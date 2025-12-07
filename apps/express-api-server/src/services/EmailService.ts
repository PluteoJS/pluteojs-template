import {
	renderEmailVerificationEmail,
	renderPasswordResetEmail,
	renderWelcomeEmail,
} from "@pluteojs/email-templates";

import logger from "@loaders/logger";

import type {DBTaskType} from "@db/repositories";
import config from "@config";
import {emailBodyTypes} from "@constants/emailServiceConstants";
import emailServiceUtil from "@util/emailServiceUtil";
import securityUtil from "@util/securityUtil";

import type {iUser} from "@customTypes/appDataTypes/userTypes";
import type {NullableString} from "@customTypes/commonTypes";

export default class EmailService {
	/**
	 * Sends the welcome email to the user specified in userDetails.
	 */
	public async sendWelcomeEmail(
		userDetails: iUser,
		dbTask: DBTaskType
	): Promise<boolean> {
		const {id: userId, firstName, email} = userDetails;

		const senderAddress =
			config.emailService.transactionalEmail.smtpFromAddress;
		const subject = "Welcome to PluteoJS";

		// Render HTML and plain text versions using react-email templates
		const htmlBody = await renderWelcomeEmail({
			firstName,
			appName: "PluteoJS",
		});
		const textBody = await renderWelcomeEmail(
			{firstName, appName: "PluteoJS"},
			{plainText: true}
		);

		logger.silly("Sending welcome email");
		const messageSendResult = await emailServiceUtil.sendTransactionHtmlEmail(
			senderAddress,
			email,
			null,
			null,
			subject,
			textBody,
			htmlBody
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
				emailBodyTypes.HTML,
				htmlBody
			);

			return true;
		}

		return false;
	}

	/**
	 * Sends the OTP to the user for password reset.
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

		// Render HTML and plain text versions using react-email templates
		const htmlBody = await renderPasswordResetEmail({
			firstName,
			otp,
			clientIp,
			expirationMinutes: 10,
		});
		const textBody = await renderPasswordResetEmail(
			{firstName, otp, clientIp, expirationMinutes: 10},
			{plainText: true}
		);

		logger.silly("Sending password reset email");
		const messageSendResult = await emailServiceUtil.sendTransactionHtmlEmail(
			senderAddress,
			email,
			null,
			null,
			subject,
			textBody,
			htmlBody
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
				emailBodyTypes.HTML,
				htmlBody
			);
			return true;
		}
		return false;
	}

	/**
	 * Sends the OTP to verify the email address.
	 */
	public async sendEmailVerificationEmail(
		clientIp: NullableString,
		otp: string,
		email: string,
		dbTask: DBTaskType
	): Promise<boolean> {
		const senderAddress = config.emailService.mailgun.senderId;
		const subject = "Verify Email | PluteoJS";

		// Render HTML and plain text versions using react-email templates
		const htmlBody = await renderEmailVerificationEmail({
			otp,
			clientIp,
			expirationMinutes: 10,
		});
		const textBody = await renderEmailVerificationEmail(
			{otp, clientIp, expirationMinutes: 10},
			{plainText: true}
		);

		logger.silly("Sending email verification email");
		const messageSendResult = await emailServiceUtil.sendTransactionHtmlEmail(
			senderAddress,
			email,
			null,
			null,
			subject,
			textBody,
			htmlBody
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
				emailBodyTypes.HTML,
				htmlBody
			);
			return true;
		}

		return false;
	}
}
