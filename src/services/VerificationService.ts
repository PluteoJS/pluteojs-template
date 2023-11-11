import moment from "moment-timezone";

import logger from "@loaders/logger";

import {db} from "@db/index";
import {DBTaskType} from "@db/repositories";

import config from "@config";

import serviceUtil from "@util/serviceUtil";
import verificationUtil from "@util/verificationUtil";
import securityUtil from "@util/securityUtil";

import {iGenericServiceResult} from "@customTypes/commonServiceTypes";
import {httpStatusCodes} from "@customTypes/networkTypes";

import {verificationServiceErrors} from "@constants/errors/verificationServiceErrors";
import {momentUnitsOfTime} from "@constants/dateTimeConstants";

import EmailService from "@services/EmailService";

import {NullableString} from "@customTypes/commonTypes";

export default class VerificationService {
	emailService = new EmailService();

	public async requestEmailVerification(
		uniqueRequestId: NullableString,
		email: string,
		ipAddress: NullableString
	): Promise<iGenericServiceResult<null>> {
		return db.task("event-email-verification-request", async (task) => {
			const sendEmailVerificationOtpEmail = async (
				id: NullableString = null,
				otpToSend: NullableString = null
			): Promise<iGenericServiceResult<null>> => {
				const otp =
					otpToSend ||
					(await verificationUtil.generateEmailVerificationOTP(
						config.verificationConfig.emailVerificationOtpLength
					));

				logger.silly("Generated OTP: %s", otp);

				logger.silly("Sending email to %s", email);

				await this.emailService.sendEmailVerificationEmail(
					ipAddress,
					otp,
					email,
					task
				);
				logger.silly("Email sent successfully");

				if (id && otpToSend) {
					/**
					 * If the otp was provided, then it was already stored in the DB.
					 * So, we don't need to store it again, but we do need to update the
					 * req_date_time and updated_at fields.
					 */
					logger.silly(
						"Updating email verification request log record's updated_at in DB"
					);
					await task.emailVerificationRequestLogs.updateRequestDateTime(id);
				} else {
					/**
					 * If the otp was not provided, then it was generated and needs to be
					 * stored in the DB.
					 */
					const uuid = securityUtil.generateUUID();

					logger.silly("Creating email verification request log record in DB");
					await task.emailVerificationRequestLogs.add(
						uuid,
						email,
						ipAddress,
						otp,
						true
					);
				}

				return serviceUtil.buildResult(
					true,
					httpStatusCodes.SUCCESS_OK,
					uniqueRequestId,
					null
				);
			};

			const lastEmailVerificationRequestRecord =
				await task.emailVerificationRequestLogs.selectLatestRequestByUserEmail(
					email
				);
			if (lastEmailVerificationRequestRecord) {
				logger.silly("Found a previous email verification request record");
				const {
					id: lastEmailVerificationRequestRecordId,
					req_date_time: reqDateTime,
					created_at: creationDateTime,
					otp: lastSentOtp,
					is_otp_usable: isOtpUsable,
				} = lastEmailVerificationRequestRecord;

				if (isOtpUsable) {
					const currentTime = moment();
					const lastRequestTimeStampInDB = moment(reqDateTime);
					const lastRequestTimeDiff = currentTime.diff(
						lastRequestTimeStampInDB,
						momentUnitsOfTime.minutes
					);

					if (
						lastRequestTimeDiff >=
						config.verificationConfig.emailVerificationRetryIntervalInMinutes
					) {
						const creationTimeStampInDB = moment(creationDateTime);
						const lastCreationTimeDiff = currentTime.diff(
							creationTimeStampInDB,
							momentUnitsOfTime.minutes
						);

						if (
							lastCreationTimeDiff >
							config.verificationConfig.emailVerificationOtpValidity
						) {
							/**
							 * The last otp has been expired, thus invalidating it
							 * and sending a new one.
							 */
							logger.silly("Invalidating the last OTP");
							await task.emailVerificationRequestLogs.invalidateOtp(
								lastEmailVerificationRequestRecordId
							);

							logger.silly("Re-Sending a new OTP");
							return sendEmailVerificationOtpEmail();
						}

						/**
						 * The last otp is still valid, thus re-sending it.
						 */
						logger.silly("Re-Sending the same OTP");
						return sendEmailVerificationOtpEmail(
							lastEmailVerificationRequestRecordId,
							lastSentOtp
						);
					}
				} else {
					/**
					 * The last otp has already been used or invalidated.
					 * Thus, sending a new one.
					 */
					logger.silly("Re-Sending a new OTP");
					return sendEmailVerificationOtpEmail();
				}
			} else {
				/**
				 * No previous email verification request record found,
				 * sending a new OTP.
				 */
				logger.silly(
					"No previous email verification request record found, sending a new OTP"
				);
				return sendEmailVerificationOtpEmail();
			}

			/**
			 * The current request is too soon, thus not sending a new OTP.
			 * Instead, returning a 400 response.
			 */
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				verificationServiceErrors.emailVerificationRequest
					.RetryNotAllowedWithinCoolDownPeriod
			);
		});
	}

	public async verifyEmail(
		uniqueRequestId: NullableString,
		email: string,
		otp: string,
		dbTransaction: DBTaskType | null = null
	): Promise<iGenericServiceResult<null>> {
		/**
		 * Handles the email verification process.
		 * @param transaction - The database task object.
		 * @returns The service result.
		 */
		const handleEmailVerification = async (
			transaction: DBTaskType
		): Promise<iGenericServiceResult<null>> => {
			const lastEmailVerificationRequestRecord =
				await transaction.emailVerificationRequestLogs.selectLatestRequestByUserEmail(
					email
				);

			if (lastEmailVerificationRequestRecord) {
				const {
					id: lastEmailVerificationRequestRecordId,
					req_date_time: reqDateTime,
					otp: lastSentOtp,
					is_otp_usable: isLastSentOtpUsable,
				} = lastEmailVerificationRequestRecord;

				if (isLastSentOtpUsable) {
					const currentTime = moment();
					const lastRequestTimeStampInDB = moment(reqDateTime);

					const lastRequestTimeDiff = currentTime.diff(
						lastRequestTimeStampInDB,
						momentUnitsOfTime.minutes
					);

					if (
						lastRequestTimeDiff >
						config.verificationConfig.emailVerificationOtpValidity
					) {
						/**
						 * The last otp has been expired, thus invalidating it
						 * and returning a 400 response.
						 */
						await transaction.emailVerificationRequestLogs.invalidateOtp(
							lastEmailVerificationRequestRecordId
						);

						return serviceUtil.buildResult(
							false,
							httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
							uniqueRequestId,
							verificationServiceErrors.verifyEmailRequest.OtpExpired
						);
					}

					if (lastSentOtp === otp) {
						/**
						 * The otp is valid and matches the last sent otp, thus invalidating
						 * it for preventing further usage and returning a 204 response.
						 */
						await transaction.emailVerificationRequestLogs.invalidateOtp(
							lastEmailVerificationRequestRecordId
						);

						return serviceUtil.buildResult(
							true,
							httpStatusCodes.SUCCESS_OK,
							uniqueRequestId,
							null
						);
					}

					/**
					 * The otp is invalid, thus returning a 400 response.
					 */
					return serviceUtil.buildResult(
						false,
						httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
						uniqueRequestId,
						verificationServiceErrors.verifyEmailRequest.InvalidOtp
					);
				}
				/**
				 * The last otp has already been invalidated, thus returning a 400 response.
				 */
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					verificationServiceErrors.verifyEmailRequest.OtpExpired
				);
			}

			/**
			 * No previous email verification request record found for the given email.
			 * Returning a 400 response.
			 */
			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				verificationServiceErrors.verifyEmailRequest.NoVerificationRequestFound
			);
		};

		/**
		 * If a dbTransaction is provided, then using it to execute the task.
		 */
		if (dbTransaction) {
			return handleEmailVerification(dbTransaction);
		}

		/**
		 * If no dbTransaction is provided, then creating a new one and executing the task.
		 */
		return db.tx("event-email-verification-request", handleEmailVerification);
	}
}
