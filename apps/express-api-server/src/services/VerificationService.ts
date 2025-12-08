import moment from "moment-timezone";

import {
	eq,
	desc,
	sql,
	emailVerificationRequestLogs,
	withTransaction,
	type DbTransaction,
} from "@pluteojs/database";

import logger from "@loaders/logger";
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
		return withTransaction(async (tx) => {
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
					tx
				);
				logger.silly("Email sent successfully");

				if (id && otpToSend) {
					logger.silly(
						"Updating email verification request log record's updated_at in DB"
					);
					await tx
						.update(emailVerificationRequestLogs)
						.set({
							reqDateTime: sql`CURRENT_TIMESTAMP`,
							updatedAt: sql`CURRENT_TIMESTAMP`,
						})
						.where(eq(emailVerificationRequestLogs.id, id));
				} else {
					const uuid = securityUtil.generateUUID();

					logger.silly("Creating email verification request log record in DB");
					await tx.insert(emailVerificationRequestLogs).values({
						id: uuid,
						email,
						reqDateTime: new Date(),
						reqIpAddress: ipAddress,
						otp,
						isOtpUsable: true,
					});
				}

				return serviceUtil.buildResult(
					true,
					httpStatusCodes.SUCCESS_OK,
					uniqueRequestId,
					null
				);
			};

			const lastEmailVerificationRequestRecords = await tx
				.select()
				.from(emailVerificationRequestLogs)
				.where(eq(emailVerificationRequestLogs.email, email))
				.orderBy(desc(emailVerificationRequestLogs.reqDateTime))
				.limit(1);

			const lastEmailVerificationRequestRecord =
				lastEmailVerificationRequestRecords[0];

			if (lastEmailVerificationRequestRecord) {
				logger.silly("Found a previous email verification request record");
				const {
					id: lastEmailVerificationRequestRecordId,
					reqDateTime,
					createdAt: creationDateTime,
					otp: lastSentOtp,
					isOtpUsable,
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
							await tx
								.update(emailVerificationRequestLogs)
								.set({
									isOtpUsable: false,
									updatedAt: sql`CURRENT_TIMESTAMP`,
								})
								.where(
									eq(
										emailVerificationRequestLogs.id,
										lastEmailVerificationRequestRecordId
									)
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
		dbTransaction: DbTransaction | null = null
	): Promise<iGenericServiceResult<null>> {
		const handleEmailVerification = async (
			transaction: DbTransaction
		): Promise<iGenericServiceResult<null>> => {
			const lastEmailVerificationRequestRecords = await transaction
				.select()
				.from(emailVerificationRequestLogs)
				.where(eq(emailVerificationRequestLogs.email, email))
				.orderBy(desc(emailVerificationRequestLogs.reqDateTime))
				.limit(1);

			const lastEmailVerificationRequestRecord =
				lastEmailVerificationRequestRecords[0];

			if (lastEmailVerificationRequestRecord) {
				const {
					id: lastEmailVerificationRequestRecordId,
					reqDateTime,
					otp: lastSentOtp,
					isOtpUsable: isLastSentOtpUsable,
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
						await transaction
							.update(emailVerificationRequestLogs)
							.set({
								isOtpUsable: false,
								updatedAt: sql`CURRENT_TIMESTAMP`,
							})
							.where(
								eq(
									emailVerificationRequestLogs.id,
									lastEmailVerificationRequestRecordId
								)
							);

						return serviceUtil.buildResult(
							false,
							httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
							uniqueRequestId,
							verificationServiceErrors.verifyEmailRequest.OtpExpired
						);
					}

					if (lastSentOtp === otp) {
						await transaction
							.update(emailVerificationRequestLogs)
							.set({
								isOtpUsable: false,
								updatedAt: sql`CURRENT_TIMESTAMP`,
							})
							.where(
								eq(
									emailVerificationRequestLogs.id,
									lastEmailVerificationRequestRecordId
								)
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

		return withTransaction(handleEmailVerification);
	}
}
