/**
 * Better Auth Loader
 *
 * Configures the better-auth email handlers with the application's email service.
 * This must be called during app initialization before better-auth routes are used.
 */
import {configureEmailHandlers, type iEmailSendOptions} from "@pluteojs/better-auth";

import config from "@config";
import logger from "@loaders/logger";
import emailServiceUtil from "@util/emailServiceUtil";

/**
 * Sends an email using the application's email service utility.
 *
 * @param options - Email send options from better-auth
 */
async function sendEmail(options: iEmailSendOptions): Promise<void> {
	const {from, to, subject, html, text} = options;

	await emailServiceUtil.sendTransactionHtmlEmail(
		from,
		to,
		null, // cc
		null, // bcc
		subject,
		text || "", // Plain text fallback
		html
	);
}

/**
 * Configures the better-auth email handlers with the application's services.
 *
 * This sets up:
 * - Email sender using the transactional email service
 * - Logger adapter for the better-auth email handlers
 * - From address from the app configuration
 * - App name for email templates
 */
function loadBetterAuth(): void {
	configureEmailHandlers({
		sender: sendEmail,
		logger: {
			info: (requestId: string, message: string, data?: unknown) => {
				logger.info(requestId, message, null, data);
			},
			error: (requestId: string, message: string, error?: unknown) => {
				logger.error(requestId, message, error);
			},
		},
		fromAddress: config.emailService.transactionalEmail.smtpFromAddress,
		appName: config.serviceInfo.name || "PluteoJS",
	});

	logger.info(null, "Better Auth email handlers configured");
}

export default loadBetterAuth;
