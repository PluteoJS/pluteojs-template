import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import config from "@config";

import {NullableString} from "@customTypes/commonTypes";

const transactionEmailTransporter = nodemailer.createTransport({
	host: config.emailService.transactionalEmail.smtpHost,
	port: config.emailService.transactionalEmail.smtpPort,
	secure: config.emailService.transactionalEmail.smtpSecure, // Set to true if using SSL/TLS
	auth: {
		user: config.emailService.transactionalEmail.smtpUsername,
		pass: config.emailService.transactionalEmail.smtpPassword,
	},
});

const marketingEmailTransporter = nodemailer.createTransport({
	host: config.emailService.marketingEmail.smtpHost,
	port: config.emailService.marketingEmail.smtpPort,
	secure: config.emailService.marketingEmail.smtpSecure, // Set to true if using SSL/TLS
	auth: {
		user: config.emailService.marketingEmail.smtpUsername,
		pass: config.emailService.marketingEmail.smtpPassword,
	},
});

/**
 * Builds the mail options object.
 *
 * @param from - The email address of the sender.
 * @param to - The email address of the receiver.
 * @param cc - The email address of the receiver for cc.
 * @param bcc - The email address of the receiver for bcc.
 * @param subject - The subject of the email.
 * @param textBody - The text body of the email.
 * @param htmlBody - The html body of the email.
 * @returns - The mail options object.
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
 * Sends text type body email.
 *
 * This will scheduled a text type body email on Mailgun and the
 * Mailgun service will send the e-mail in an immediate future time.
 *
 * @param from
 * @param to
 * @param subject
 * @param textBody
 * @returns result
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
 * Sends text type body email.
 *
 * This will scheduled a text type body email on Mailgun and the
 * Mailgun service will send the e-mail in an immediate future time.
 *
 * @param from
 * @param to
 * @param subject
 * @param textBody
 * @returns result
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
 * While sending email using Nodemailer, the result of the send request is
 * returning the blow object as the result:
 * {.., "messageId": "<da6025d0-1304-39fe-6a49-634e5a82f326@dev.example.com>"", ...}
 * In this object, the value of id has a "<" symbol at the beginning and
 * a ">" symbol at the end. This function is for parsing just the id value
 * by removing both of the symbols from the original id value.
 *
 * @param messageIdWithSymbols
 * @returns messageId
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
