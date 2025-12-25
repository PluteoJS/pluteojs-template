import moment from "moment-timezone";

import {
	db,
	eq,
	desc,
	sql,
	emailVerificationRequestLogs,
	type DBTransaction,
} from "@pluteojs/database";

import logger from "@loaders/logger";
import config from "@config";
import verificationUtil from "@util/verificationUtil";
import securityUtil from "@util/securityUtil";

import {httpStatusCodes} from "@customTypes/networkTypes";
import type {NullableString} from "@customTypes/commonTypes";

import {ServiceError} from "@errors/ServiceError";
import {verificationServiceErrors} from "@constants/errors/verificationServiceErrors";
import {momentUnitsOfTime} from "@constants/dateTimeConstants";

import EmailService from "@services/EmailService";

export default class VerificationService {
	emailService = new EmailService();

	public async requestEmailVerification(
		email: string,
		ipAddress: NullableString
	): Promise<null> {
		return db.transaction(async (tx) => {
			const sendEmailVerificationOtpEmail = async (
				id: NullableString = null,
				otpToSend: NullableString = null
			): Promise<null> => {
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

				return null;
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

			throw new ServiceError(
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				verificationServiceErrors.emailVerificationRequest
					.RetryNotAllowedWithinCoolDownPeriod
			);
		});
	}

	public async verifyEmail(
		email: string,
		otp: string,
		dbTransaction: DBTransaction | null = null
	): Promise<null> {
		const handleEmailVerification = async (
			transaction: DBTransaction
		): Promise<null> => {
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

						throw new ServiceError(
							httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
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

						return null;
					}

					throw new ServiceError(
						httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
						verificationServiceErrors.verifyEmailRequest.InvalidOtp
					);
				}

				throw new ServiceError(
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					verificationServiceErrors.verifyEmailRequest.OtpExpired
				);
			}

			throw new ServiceError(
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				verificationServiceErrors.verifyEmailRequest.NoVerificationRequestFound
			);
		};

		if (dbTransaction) {
			return handleEmailVerification(dbTransaction);
		}

		return db.transaction(handleEmailVerification);
	}
}
