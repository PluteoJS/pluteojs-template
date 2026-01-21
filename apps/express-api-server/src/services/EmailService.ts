import {
	renderEmailVerificationEmail,
	renderPasswordResetEmail,
	renderWelcomeEmail,
} from "@pluteojs/email-templates";

import {emailLogs, type DBTransaction} from "@pluteojs/database";

import logger from "@loaders/logger";
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
		dbTx: DBTransaction
	): Promise<boolean> {
		const {id: userId, name, email} = userDetails;
		// Extract first name from full name
		const firstName = name.split(" ")[0] || name;

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
			await dbTx.insert(emailLogs).values({
				id: uuid,
				userId,
				messageId,
				senderAddress,
				targetAddress: email,
				subject,
				bodyType: emailBodyTypes.HTML,
				body: htmlBody,
			});

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
		dbTx: DBTransaction
	): Promise<boolean> {
		const {id: userId, name, email} = userDetails;
		// Extract first name from full name
		const firstName = name.split(" ")[0] || name;

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
			await dbTx.insert(emailLogs).values({
				id: uuid,
				userId,
				messageId,
				senderAddress,
				targetAddress: email,
				subject,
				bodyType: emailBodyTypes.HTML,
				body: htmlBody,
			});
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
		dbTx: DBTransaction
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
			await dbTx.insert(emailLogs).values({
				id: uuid,
				userId: null,
				messageId,
				senderAddress,
				targetAddress: email,
				subject,
				bodyType: emailBodyTypes.HTML,
				body: htmlBody,
			});
			return true;
		}

		return false;
	}
}
