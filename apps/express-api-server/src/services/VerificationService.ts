import moment from "moment-timezone";

import logger from "@loaders/logger";
import {db} from "@db/index";
import type {DBTaskType} from "@db/repositories";
import config from "@config";
import serviceUtil from "@util/serviceUtil";
import verificationUtil from "@util/verificationUtil";
import securityUtil from "@util/securityUtil";

import type {iGenericServiceResult} from "@customTypes/serviceTypes";
import {httpStatusCodes} from "@customTypes/networkTypes";
import type {NullableString} from "@customTypes/commonTypes";

import {verificationServiceErrors} from "@constants/errors/verificationServiceErrors";
import {momentUnitsOfTime} from "@constants/dateTimeConstants";

import EmailService from "@services/EmailService";

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
					logger.silly(
						"Updating email verification request log record's updated_at in DB"
					);
					await task.emailVerificationRequestLogs.updateRequestDateTime(id);
				} else {
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
							logger.silly("Invalidating the last OTP");
							await task.emailVerificationRequestLogs.invalidateOtp(
								lastEmailVerificationRequestRecordId
							);

							logger.silly("Re-Sending a new OTP");
							return sendEmailVerificationOtpEmail();
						}

						logger.silly("Re-Sending the same OTP");
						return sendEmailVerificationOtpEmail(
							lastEmailVerificationRequestRecordId,
							lastSentOtp
						);
					}
				} else {
					logger.silly("Re-Sending a new OTP");
					return sendEmailVerificationOtpEmail();
				}
			} else {
				logger.silly(
					"No previous email verification request record found, sending a new OTP"
				);
				return sendEmailVerificationOtpEmail();
			}

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

					return serviceUtil.buildResult(
						false,
						httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
						uniqueRequestId,
						verificationServiceErrors.verifyEmailRequest.InvalidOtp
					);
				}
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					verificationServiceErrors.verifyEmailRequest.OtpExpired
				);
			}

			return serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				verificationServiceErrors.verifyEmailRequest.NoVerificationRequestFound
			);
		};

		if (dbTransaction) {
			return handleEmailVerification(dbTransaction);
		}

		return db.tx("event-email-verification-request", handleEmailVerification);
	}
}
