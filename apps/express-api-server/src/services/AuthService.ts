import argon2 from "argon2";
import moment from "moment-timezone";

import {
	db,
	eq,
	desc,
	users,
	resetPasswordLogs,
} from "@pluteojs/database";

import resetPasswordUtil from "@util/resetPasswordUtil";
import logger from "@loaders/logger";
import config from "@config";
import securityUtil from "@util/securityUtil";
import serviceUtil from "@util/serviceUtil";

import type {
	iGenericServiceResult,
	NullableServiceSuccess,
} from "@customTypes/serviceTypes";
import {httpStatusCodes} from "@customTypes/networkTypes";
import type {iTokenPair} from "@customTypes/appDataTypes/authTypes";
import type {iUser, iUserInputDTO} from "@customTypes/appDataTypes/userTypes";
import type {NullableString} from "@customTypes/commonTypes";

import {authServiceErrors} from "@constants/errors/authServiceErrors";
import {authServiceSuccessMessage} from "@constants/successes/authServiceSuccessMessages";
import {momentUnitsOfTime} from "@constants/dateTimeConstants";

import EmailService from "@services/EmailService";

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

		return db.transaction(async (tx) => {
			const currentUserRecords = await tx
				.select()
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (currentUserRecords[0]) {
				logger.silly("Abort sign up: user already exits");
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					authServiceErrors.signUp.UserAlreadyExists
				);
			}

			logger.silly("Generating user id");
			const userId = securityUtil.generateUUID();

			logger.silly("Hashing password");
			const hashedPassword = await argon2.hash(password);

			logger.silly("Creating user db record");
			const [userRecord] = await tx
				.insert(users)
				.values({
					id: userId,
					firstName,
					lastName,
					email,
					phoneNumber: null,
					password: hashedPassword,
					createdAt: new Date(),
				})
				.returning();

			logger.silly("Constructing user object for response from the userRecord");
			const user: iUser = {
				id: userRecord!.id,
				firstName: userRecord!.firstName,
				lastName: userRecord!.lastName,
				email: userRecord!.email,
				createdAt: userRecord!.createdAt?.toISOString() ?? "",
			};

			logger.silly("Generating accessToken & refreshToken pair for the user");
			const {accessToken, refreshToken} = securityUtil.generateJWTPair(
				{
					uid: userRecord!.id,
				},
				{
					uid: userRecord!.id,
				}
			);

			logger.silly("Attempting to send welcome email");
			try {
				await this.emailService.sendWelcomeEmail(user, tx);
			} catch (error) {
				logger.warning(
					uniqueRequestId,
					"Failed to send welcome email. Continuing without email.",
					error as Error
				);
			}

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
		logger.silly("Retrieving the userRecord by email id");
		const userRecords = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		const userRecord = userRecords[0];

		if (userRecord) {
			const {id, password: passwordHash} = userRecord;

			logger.silly("Checking whether the password is correct or not");
			const isPasswordMatches = await argon2.verify(
				passwordHash ?? "",
				password
			);

			if (isPasswordMatches) {
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

			logger.silly("Abort sign in: incorrect password");
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				authServiceErrors.signIn.IncorrectUserCredential
			);
		}

		logger.silly("Abort sign in: user doesn't exits");
		return serviceUtil.buildResult(
			false,
			httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
			uniqueRequestId,
			authServiceErrors.signIn.IncorrectUserCredential
		);
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
		return db.transaction(async (tx) => {
			logger.silly("Retrieving the userRecord by email id");
			const userRecords = await tx
				.select()
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			const userRecord = userRecords[0];

			if (userRecord) {
				const sendOtpEmail = async (): Promise<iGenericServiceResult<null>> => {
					const user: iUser = {
						id: userRecord.id,
						firstName: userRecord.firstName,
						lastName: userRecord.lastName,
						email: userRecord.email,
						createdAt: userRecord.createdAt?.toISOString() ?? "",
					};

					const otp = await resetPasswordUtil.generateOTP(
						config.resetPasswordConfig.otpLength
					);

					logger.silly("Attempting to send Reset Password OTP ");
					await this.emailService.sendResetPasswordEmail(
						ipAddress,
						otp,
						user,
						tx
					);
					logger.silly("Reset Password email Done ");

					const uuid = securityUtil.generateUUID();

					logger.silly("Creating Reset Password Record in DB");
					const hashedOtp = await argon2.hash(otp);
					await tx.insert(resetPasswordLogs).values({
						id: uuid,
						userId: user.id,
						email,
						datetime: new Date(),
						reqIpAddress: ipAddress,
						otp: hashedOtp,
						isOtpUsable: true,
						createdAt: new Date(),
					});

					return serviceUtil.buildResult(
						true,
						httpStatusCodes.SUCCESS_OK,
						uniqueRequestId,
						null,
						null
					);
				};

				const lastUserRecords = await tx
					.select()
					.from(resetPasswordLogs)
					.where(eq(resetPasswordLogs.userId, userRecord.id))
					.orderBy(desc(resetPasswordLogs.createdAt))
					.limit(1);

				const lastUserRecord = lastUserRecords[0];

				if (lastUserRecord) {
					logger.silly("Found a record of reset password for user");

					const currentTime = moment();
					const lastPasswordResetTimeStampInDB = moment(lastUserRecord.datetime);

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
				await sendOtpEmail();
			}

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
		return db.transaction(async (transaction) => {
			logger.debug(
				uniqueRequestId,
				"Retrieving the userRecord by email id",
				null,
				{
					email,
				}
			);

			const userRecords = await transaction
				.select()
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			const userRecord = userRecords[0];

			if (userRecord) {
				const lastPasswordResetLogRecords = await transaction
					.select()
					.from(resetPasswordLogs)
					.where(eq(resetPasswordLogs.userId, userRecord.id))
					.orderBy(desc(resetPasswordLogs.createdAt))
					.limit(1);

				const lastPasswordResetLogRecord = lastPasswordResetLogRecords[0];

				if (lastPasswordResetLogRecord) {
					logger.debug(
						uniqueRequestId,
						"Found a record of reset password request for user",
						null,
						{
							lastPasswordResetLogRecord,
						}
					);

					if (lastPasswordResetLogRecord.isOtpUsable) {
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

								await transaction
									.update(users)
									.set({password: hashedNewPassword})
									.where(eq(users.id, userRecord.id));

								logger.silly("Password reset Successfully");

								await transaction
									.update(resetPasswordLogs)
									.set({isOtpUsable: false})
									.where(eq(resetPasswordLogs.userId, userRecord.id));

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
