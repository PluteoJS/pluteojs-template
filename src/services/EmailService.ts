import logger from "@loaders/logger";

import {DBTaskType} from "@db/repositories";

import config from "@config";

import {emailBodyTypes} from "@constants/emailServiceConstants";

import emailServiceUtil from "@util/emailServiceUtil";
import securityUtil from "@util/securityUtil";

import {iUser} from "@customTypes/appDataTypes/userTypes";
import {NullableString} from "@customTypes/commonTypes";

export default class EmailService {
	/**
	 * Sends the welcome email to the user specified in userDetails.
	 *
	 * NOTE: this is not a regular service function, this can be
	 * either called directly from the router layer or from inside a
	 * fully fledged service function.
	 *
	 * @param userDetails
	 * @param dbTask
	 * @returns isSuccess
	 */
	public async sendWelcomeEmail(
		userDetails: iUser,
		dbTask: DBTaskType
	): Promise<boolean> {
		const {id: userId, firstName, email} = userDetails;

		const senderAddress =
			config.emailService.transactionalEmail.smtpFromAddress;
		const subject = "Welcome to PLUTEOJS 💐";
		const body = `Hi ${firstName}\n\nWelcome to PLUTEOJS 💐\n\n\nBest,\nTeam PLUTEOJS 🚀\n`;

		logger.silly("Sending welcome email");
		const messageSendResult = await emailServiceUtil.sendTransactionTextEmail(
			senderAddress,
			email,
			null,
			null,
			subject,
			body
		);

		logger.silly("Message send result", messageSendResult);
		const {response, messageId: messageIdWithSymbols} = messageSendResult;

		if (response.includes("250") && messageIdWithSymbols) {
			const messageId = emailServiceUtil.parseMessageId(messageIdWithSymbols);

			const uuid = securityUtil.generateUUID();

			logger.silly("Creating email log record");
			await dbTask.emailLogs.add(
				uuid,
				userId,
				messageId,
				senderAddress,
				email,
				subject,
				emailBodyTypes.TEXT,
				body
			);

			return true;
		}

		return false;
	}

	/**
	Sends the OTP to the user.
	This should called via authService 
	 * @param clientIp
	 * @param userDetails
	 * @param dbTask
	 * @returns isSuccess
	 * 
	 */
	public async sendResetPasswordEmail(
		clientIp: NullableString,
		otp: string,
		userDetails: iUser,
		dbTask: DBTaskType
	): Promise<boolean> {
		const {id: userId, firstName, email} = userDetails;

		const senderAddress =
			config.emailService.transactionalEmail.smtpFromAddress;
		const subject = "Reset Password | PluteoJS";
		const body = `Hi ${firstName}\n\n Got a reset Password request from  ${clientIp}. Your OTP: ${otp} 🚀\n`;

		logger.silly("Sending password reset email");
		const messageSendResult = await emailServiceUtil.sendTransactionTextEmail(
			senderAddress,
			email,
			null,
			null,
			subject,
			body
		);

		logger.silly("Message send result", messageSendResult);
		const {response, messageId: messageIdWithSymbols} = messageSendResult;

		if (response.includes("250") && messageIdWithSymbols) {
			const messageId = emailServiceUtil.parseMessageId(messageIdWithSymbols);

			const uuid = securityUtil.generateUUID();
			logger.silly("Creating email log record");
			await dbTask.emailLogs.add(
				uuid,
				userId,
				messageId,
				senderAddress,
				email,
				subject,
				emailBodyTypes.TEXT,
				body
			);
			return true;
		}
		return false;
	}

	/**
	 * Sends the OTP to verify the email address.
	 * This should called via verificationService
	 * @param clientIp
	 * @param email
	 * @param dbTask
	 * @returns isSuccess
	 *
	 */
	public async sendEmailVerificationEmail(
		clientIp: NullableString,
		otp: string,
		email: string,
		dbTask: DBTaskType
	): Promise<boolean> {
		const senderAddress = config.emailService.mailgun.senderId;
		const subject = "Verify Email | PLUTEOJS";
		const body = `Hi 👋\n\n Got an email verification request from  ${clientIp}.\n\nYour OTP: ${otp}\n`;

		logger.silly("Sending email verification email");
		const messageSendResult = await emailServiceUtil.sendTransactionTextEmail(
			senderAddress,
			email,
			null,
			null,
			subject,
			body
		);

		logger.silly("Message send result", messageSendResult);
		const {response, messageId: messageIdWithSymbols} = messageSendResult;

		if (response.includes("250") && messageIdWithSymbols) {
			const messageId = emailServiceUtil.parseMessageId(messageIdWithSymbols);

			const uuid = securityUtil.generateUUID();
			logger.silly("Creating email log record");
			await dbTask.emailLogs.add(
				uuid,
				null,
				messageId,
				senderAddress,
				email,
				subject,
				emailBodyTypes.TEXT,
				body
			);
			return true;
		}

		return false;
	}
}
