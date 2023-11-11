import argon2 from "argon2";
import moment from "moment-timezone";
import resetPasswordUtil from "@util/resetPasswordUtil";

import logger from "@loaders/logger";

import {db} from "@db/index";

import config from "@config";

import securityUtil from "@util/securityUtil";
import serviceUtil from "@util/serviceUtil";

import {
	iGenericServiceResult,
	NullableServiceSuccess,
} from "@customTypes/commonServiceTypes";
import {httpStatusCodes} from "@customTypes/networkTypes";
import {iTokenPair} from "@customTypes/appDataTypes/authTypes";
import {iUser, iUserInputDTO} from "@customTypes/appDataTypes/userTypes";

import {authServiceErrors} from "@constants/errors/authServiceErrors";
import {authServiceSuccessMessage} from "@constants/successMessages/authServiceSuccessMessages";
import {momentUnitsOfTime} from "@constants/dateTimeConstants";

import EmailService from "@services/EmailService";

import {NullableString} from "@customTypes/commonTypes";

export default class AuthService {
	emailService = new EmailService();

	public async signUp(
		uniqueRequestId: NullableString,
		userInputDTO: iUserInputDTO
	): Promise<
		iGenericServiceResult<{
			user: iUser;
			tokens: iTokenPair;
		} | null>
	> {
		const {firstName, lastName, email, password} = userInputDTO;

		return db.task("user-signup", async (task) => {
			// checking whether the user already exists or not by using their email id.
			const currentUserRecord = await task.users.findByEmail(email);
			if (currentUserRecord) {
				// user already exists.
				logger.silly("Abort sign up: user already exits");
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					authServiceErrors.signUp.UserAlreadyExists
				);
			}
			// else: user doesn't exists already, can proceed to creation

			logger.silly("Generating user id");
			const userId = securityUtil.generateUUID();

			logger.silly("Hashing password");
			const hashedPassword = await argon2.hash(password);

			logger.silly("Creating user db record");
			const userRecord = await task.users.add(
				userId,
				firstName,
				lastName,
				email,
				/*
					currently we're not supporting adding phone number. So setting it as null.
				*/
				null,
				hashedPassword
			);

			logger.silly("Constructing user object for response from the userRecord");
			const user: iUser = {
				id: userRecord.id,
				firstName: userRecord.first_name,
				lastName: userRecord.last_name,
				email: userRecord.email,
				createdAt: userRecord.created_at,
			};

			logger.silly("Generating accessToken & refreshToken pair for the user");
			const {accessToken, refreshToken} = securityUtil.generateJWTPair(
				{
					uid: userRecord.id,
				},
				{
					uid: userRecord.id,
				}
			);

			logger.silly("Attempting to send welcome email");
			await this.emailService.sendWelcomeEmail(user, task);

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				{
					user,
					tokens: {
						accessToken,
						refreshToken,
					},
				}
			);
		});
	}

	public async signIn(
		uniqueRequestId: NullableString,
		email: string,
		password: string
	): Promise<iGenericServiceResult<iTokenPair | null>> {
		return db.task("user-sign-in", async (task) => {
			logger.silly("Retrieving the userRecord by email id");
			const userRecord = await task.users.findByEmail(email);
			if (userRecord) {
				// user with email id exists
				const {id, password: passwordHash} = userRecord;

				logger.silly("Checking whether the password is correct or not");
				const isPasswordMatches = await argon2.verify(passwordHash, password);

				if (isPasswordMatches) {
					// user passed the correct password, issuing token-pair.
					const tokenPair = securityUtil.generateJWTPair(
						{
							uid: id,
						},
						{
							uid: id,
						}
					);

					return serviceUtil.buildResult(
						true,
						httpStatusCodes.SUCCESS_OK,
						uniqueRequestId,
						null,
						tokenPair
					);
				}

				// user passed an incorrect password.
				// user doesn't exists
				logger.silly("Abort sign in: incorrect password");
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					authServiceErrors.signIn.IncorrectUserCredential
				);
			}

			// user doesn't exists
			logger.silly("Abort sign in: user doesn't exits");
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				authServiceErrors.signIn.IncorrectUserCredential
			);
		});
	}

	public async renewAccessToken(
		uniqueRequestId: NullableString,
		refreshToken: string
	): Promise<iGenericServiceResult<iTokenPair | null>> {
		const {isValid, decodedToken} = securityUtil.verifyJWT(
			uniqueRequestId,
			refreshToken
		);

		if (isValid && decodedToken) {
			const {uid: userId} = decodedToken;

			logger.silly(
				"Generating new pair of accessToken & refreshToken for the user with userId"
			);
			const tokenPair = securityUtil.generateJWTPair(
				{
					uid: userId,
				},
				{
					uid: userId,
				}
			);

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				tokenPair
			);
		}

		logger.silly("Abort renew access token: invalid refreshToken");
		return serviceUtil.buildResult(
			false,
			httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
			uniqueRequestId,
			authServiceErrors.renewAccessToken.InvalidRefreshToken
		);
	}

	public async requestResetPassword(
		uniqueRequestId: NullableString,
		email: string,
		ipAddress: NullableString
	): Promise<iGenericServiceResult<null>> {
		return db.task("password-reset-request", async (task) => {
			logger.silly("Retrieving the userRecord by email id");
			const userRecord = await task.users.findByEmail(email);

			if (userRecord) {
				const sendOtpEmail = async (): Promise<iGenericServiceResult<null>> => {
					const user: iUser = {
						id: userRecord.id,
						firstName: userRecord.first_name,
						lastName: userRecord.last_name,
						email: userRecord.email,
						createdAt: userRecord.created_at,
					};

					const otp = await resetPasswordUtil.generateOTP(
						config.resetPasswordConfig.otpLength
					);

					logger.silly("Attempting to send Reset Password OTP ");
					await this.emailService.sendResetPasswordEmail(
						ipAddress,
						otp,
						user,
						task
					);
					logger.silly("Reset Password email Done ");

					const uuid = securityUtil.generateUUID();

					logger.silly("Creating Reset Password Record in DB");
					const hashedOtp = await argon2.hash(otp);
					await task.resetPasswordLogs.add(
						uuid,
						user.id,
						email,
						ipAddress,
						hashedOtp,
						true
					);

					return serviceUtil.buildResult(
						true,
						httpStatusCodes.SUCCESS_OK,
						uniqueRequestId,
						null,
						null
					);
				};

				const lastUserRecord = await task.resetPasswordLogs.selectLatestReq(
					userRecord.id
				);

				if (lastUserRecord) {
					logger.silly("Found a record of reset password for user");

					const currentTime = moment();
					const lastPasswordResetTimeStampInDB = moment(
						lastUserRecord.datetime
					);

					const lastRequestTimeDiff = currentTime.diff(
						lastPasswordResetTimeStampInDB,
						momentUnitsOfTime.minutes
					);

					if (
						lastRequestTimeDiff >
						config.resetPasswordConfig.retryIntervalInMinutes
					) {
						await sendOtpEmail();
					} else {
						logger.silly(
							`Got a requesting less than ${config.resetPasswordConfig.retryIntervalInMinutes} mnts. Skipping email`
						);
						return serviceUtil.buildResult(
							true,
							httpStatusCodes.SUCCESS_OK,
							uniqueRequestId,
							null,
							null
						);
					}
				}
				// initial request from user to reset password
				await sendOtpEmail();
			}

			// user doesn't exists
			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				null
			);
		});
	}

	public async resetPassword(
		uniqueRequestId: NullableString,
		email: string,
		otp: string,
		newPassword: string
	): Promise<iGenericServiceResult<NullableServiceSuccess>> {
		return db.tx("password-reset", async (transaction) => {
			logger.debug(
				uniqueRequestId,
				"Retrieving the userRecord by email id",
				null,
				{
					email,
				}
			);

			const userRecord = await transaction.users.findByEmail(email);

			if (userRecord) {
				const lastPasswordResetLogRecord =
					await transaction.resetPasswordLogs.selectLatestReq(userRecord.id);
				if (lastPasswordResetLogRecord) {
					logger.debug(
						uniqueRequestId,
						"Found a record of reset password request for user",
						null,
						{
							lastPasswordResetLogRecord,
						}
					);

					if (lastPasswordResetLogRecord.is_otp_usable) {
						const otpCreatedTimeFromDbInMoment = moment(
							lastPasswordResetLogRecord.datetime
						);
						const currentTime = moment();

						const lastOtpTimeDifference = currentTime.diff(
							otpCreatedTimeFromDbInMoment,
							momentUnitsOfTime.minutes
						);

						if (
							lastOtpTimeDifference <= config.resetPasswordConfig.otpValidity
						) {
							logger.debug(uniqueRequestId, "OTP is usable", null, {
								lastOtpTimeDifference,
							});

							const otpSentFromServer = lastPasswordResetLogRecord.otp;

							const isOtpMatches = await argon2.verify(otpSentFromServer, otp);

							if (isOtpMatches) {
								logger.silly("OTP verified Successfully");

								const hashedNewPassword = await argon2.hash(newPassword);

								await transaction.users.updatePassword(
									hashedNewPassword,
									userRecord.id
								);

								logger.silly("Password reset Successfully");

								await transaction.resetPasswordLogs.invalidateOtp(
									userRecord.id
								);

								logger.silly("OTP invalidated ");

								return serviceUtil.buildResult(
									true,
									httpStatusCodes.SUCCESS_OK,
									uniqueRequestId,
									null,
									authServiceSuccessMessage.passwordReset.passwordResetSuccess
								);
							}
						} else {
							logger.silly("OTP expired");

							return serviceUtil.buildResult(
								false,
								httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
								uniqueRequestId,
								authServiceErrors.resetPassword.otpExpired,
								null
							);
						}

						logger.silly("OTP is not verified");
						return serviceUtil.buildResult(
							false,
							httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
							uniqueRequestId,
							authServiceErrors.resetPassword.otpNotVerified,
							null
						);
					}

					logger.silly("OTP is not usable ");

					return serviceUtil.buildResult(
						false,
						httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
						uniqueRequestId,
						authServiceErrors.resetPassword.otpExpired,
						null
					);
				}

				logger.debug(
					uniqueRequestId,
					"No record of reset password request for the user",
					null,
					{
						email,
					}
				);

				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					authServiceErrors.resetPassword.otpNotIssued,
					null
				);
			}

			logger.debug(uniqueRequestId, "No user record with email", null, {
				email,
			});

			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				authServiceErrors.resetPassword.userNotExist,
				null
			);
		});
	}
}
