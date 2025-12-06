import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import config from "@config";

import type {NullableString} from "@customTypes/commonTypes";

const transactionEmailTransporter = nodemailer.createTransport({
	host: config.emailService.transactionalEmail.smtpHost,
	port: config.emailService.transactionalEmail.smtpPort,
	secure: config.emailService.transactionalEmail.smtpSecure,
	auth: {
		user: config.emailService.transactionalEmail.smtpUsername,
		pass: config.emailService.transactionalEmail.smtpPassword,
	},
});

const marketingEmailTransporter = nodemailer.createTransport({
	host: config.emailService.marketingEmail.smtpHost,
	port: config.emailService.marketingEmail.smtpPort,
	secure: config.emailService.marketingEmail.smtpSecure,
	auth: {
		user: config.emailService.marketingEmail.smtpUsername,
		pass: config.emailService.marketingEmail.smtpPassword,
	},
});

/**
 * Builds the mail options object.
 */
function buildMailOptions(
	from: string,
	to: string,
	cc: NullableString,
	bcc: NullableString,
	subject: string,
	textBody: NullableString,
	htmlBody: NullableString
): nodemailer.SendMailOptions {
	const mailOptions: nodemailer.SendMailOptions = {
		from,
		to,
		cc: cc || "",
		bcc: bcc || "",
		subject,
		text: textBody || "",
		html: htmlBody || "",
	};

	return mailOptions;
}

/**
 * Sends text type body email via transactional email service.
 */
async function sendTransactionTextEmail(
	from: string,
	to: string,
	cc: NullableString,
	bcc: NullableString,
	subject: string,
	textBody: string
): Promise<SMTPTransport.SentMessageInfo> {
	const mailOptions = buildMailOptions(
		from,
		to,
		cc,
		bcc,
		subject,
		textBody,
		null
	);

	const response = await transactionEmailTransporter.sendMail(mailOptions);

	return response;
}

/**
 * Sends text type body email via marketing email service.
 */
async function sendMarketingTextEmail(
	from: string,
	to: string,
	cc: NullableString,
	bcc: NullableString,
	subject: string,
	textBody: string
): Promise<SMTPTransport.SentMessageInfo> {
	const mailOptions = buildMailOptions(
		from,
		to,
		cc,
		bcc,
		subject,
		textBody,
		null
	);

	const response = await marketingEmailTransporter.sendMail(mailOptions);

	return response;
}

/**
 * Parses the message ID by removing < and > symbols from the original value.
 */
function parseMessageId(messageIdWithSymbols: string): string {
	let parsedMessageId: string = messageIdWithSymbols;

	parsedMessageId = parsedMessageId.replace("<", "");
	parsedMessageId = parsedMessageId.replace(">", "");

	return parsedMessageId;
}

export default {
	sendTransactionTextEmail,
	sendMarketingTextEmail,
	parseMessageId,
};
