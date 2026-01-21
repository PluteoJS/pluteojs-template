/**
 * Email handlers for better-auth callbacks.
 *
 * These handlers render email templates and send emails using a configured email sender.
 * The email sender must be configured via `configureEmailSender()` before use.
 */
import {
	renderBetterAuthEmailVerificationEmail,
	renderBetterAuthPasswordResetEmail,
	renderOrganizationInvitationEmail,
} from "@pluteojs/email-templates";

import config from "../config/index.js";
import type {
	EmailVerificationData,
	OrganizationInviteEmailData,
	PasswordResetEmailData,
} from "../types/index.js";

// ============================================================================
// Email Sender Configuration
// ============================================================================

/**
 * Interface for the email sender function.
 * This should be implemented by the consuming application (e.g., express-api-server).
 */
export interface iEmailSendOptions {
	from: string;
	to: string;
	subject: string;
	html: string;
	text?: string;
	metadata?: Record<string, unknown>;
}

export type EmailSenderFn = (options: iEmailSendOptions) => Promise<void>;

/**
 * Interface for the logger used by email handlers.
 */
export interface iEmailLogger {
	info: (requestId: string, message: string, data?: unknown) => void;
	error: (requestId: string, message: string, error?: unknown) => void;
}

/**
 * Configuration for email handlers.
 */
interface iEmailHandlerConfig {
	sender: EmailSenderFn;
	logger?: iEmailLogger;
	fromAddress: string;
	appName?: string;
}

let emailConfig: iEmailHandlerConfig | null = null;

/**
 * Configure the email sender for better-auth email handlers.
 * Must be called before any email handler is invoked.
 *
 * @param config - Email handler configuration
 */
export function configureEmailHandlers(handlerConfig: iEmailHandlerConfig): void {
	emailConfig = handlerConfig;
}

/**
 * Get the configured email sender.
 * Throws if not configured.
 */
function getEmailConfig(): iEmailHandlerConfig {
	if (!emailConfig) {
		throw new Error(
			"Email handlers not configured. Call configureEmailHandlers() before using better-auth email features."
		);
	}
	return emailConfig;
}

/**
 * Console-based fallback logger.
 */
const consoleLogger: iEmailLogger = {
	info: (requestId, message, data) => {
		console.log(`[${requestId}] ${message}`, data || "");
	},
	error: (requestId, message, error) => {
		console.error(`[${requestId}] ${message}`, error || "");
	},
};

/**
 * Get request ID from the request headers.
 */
function getRequestId(request?: Request): string {
	if (!request) {
		return "no-request-id";
	}

	// Try common request ID headers
	const requestId =
		request.headers.get("x-request-id") ||
		request.headers.get("x-correlation-id") ||
		request.headers.get("request-id") ||
		"unknown-request-id";

	return requestId;
}

// ============================================================================
// Email Handlers
// ============================================================================

/**
 * Handle sending email verification emails.
 *
 * @param data - Email verification data from better-auth
 * @param request - Optional request object for context
 */
async function handleSendVerificationEmail(
	data: EmailVerificationData,
	request?: Request
): Promise<void> {
	const cfg = getEmailConfig();
	const logger = cfg.logger || consoleLogger;
	const requestId = getRequestId(request);

	try {
		logger.info(requestId, "Handling email verification", {
			userEmail: data.user.email,
			userName: data.user.name,
		});

		// Calculate expiration date (default: 24 hours from now)
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

		// Render React email template to HTML
		const html = await renderBetterAuthEmailVerificationEmail({
			name: data.user.name,
			email: data.user.email,
			verificationUrl: data.url,
			expiresAt,
			appName: cfg.appName || "PluteoJS",
		});

		// Render plain text version
		const text = await renderBetterAuthEmailVerificationEmail(
			{
				name: data.user.name,
				email: data.user.email,
				verificationUrl: data.url,
				expiresAt,
				appName: cfg.appName || "PluteoJS",
			},
			{plainText: true}
		);

		const subject = `Verify your email address for ${cfg.appName || "PluteoJS"}`;

		// Send email
		await cfg.sender({
			from: cfg.fromAddress,
			to: data.user.email,
			subject,
			html,
			text,
			metadata: {
				type: "email_verification",
				userId: data.user.id,
				userEmail: data.user.email,
				userName: data.user.name,
				verificationUrl: data.url,
				token: data.token,
				expiresAt: expiresAt.toISOString(),
				requestId,
			},
		});

		logger.info(requestId, "Email verification sent successfully", {
			userEmail: data.user.email,
		});
	} catch (error) {
		logger.error(requestId, "Failed to send email verification", error);

		/**
		 * Re-throwing the error to break the better auth flow as sending the verification email
		 * is a critical part of the email verification process.
		 */
		throw error;
	}
}

/**
 * Handle sending organization invitation emails.
 *
 * @param data - Organization invitation data from better-auth
 * @param request - Optional request object for context
 */
async function handleOrgInviteEmail(
	data: OrganizationInviteEmailData,
	request?: Request
): Promise<void> {
	const cfg = getEmailConfig();
	const logger = cfg.logger || consoleLogger;
	const requestId = getRequestId(request);

	try {
		logger.info(requestId, "Handling organization invitation email", {
			inviteeEmail: data.email,
			organizationName: data.organization.name,
			role: data.role,
		});

		// Construct the invitation acceptance URL
		const invitationUrl = `${config.betterAuth.baseURL}/accept-invitation/${data.id}`;

		// Render React email template to HTML
		const html = await renderOrganizationInvitationEmail({
			inviteeEmail: data.email,
			inviterName: data.inviter.user.name,
			organizationName: data.organization.name,
			role: data.role,
			invitationUrl,
			expiresAt: data.invitation.expiresAt,
			organizationLogo: data.organization.logo || undefined,
			appName: cfg.appName || "PluteoJS",
		});

		// Render plain text version
		const text = await renderOrganizationInvitationEmail(
			{
				inviteeEmail: data.email,
				inviterName: data.inviter.user.name,
				organizationName: data.organization.name,
				role: data.role,
				invitationUrl,
				expiresAt: data.invitation.expiresAt,
				organizationLogo: data.organization.logo || undefined,
				appName: cfg.appName || "PluteoJS",
			},
			{plainText: true}
		);

		const subject = `You've been invited to join ${data.organization.name}`;

		// Send email
		await cfg.sender({
			from: cfg.fromAddress,
			to: data.email,
			subject,
			html,
			text,
			metadata: {
				type: "organization_invitation",
				inviteeEmail: data.email,
				inviterName: data.inviter.user.name,
				inviterEmail: data.inviter.user.email,
				inviterUserId: data.inviter.userId,
				organizationId: data.organization.id,
				organizationName: data.organization.name,
				organizationSlug: data.organization.slug,
				role: data.role,
				invitationId: data.id,
				invitationUrl,
				expiresAt: data.invitation.expiresAt.toISOString(),
				requestId,
			},
		});

		logger.info(requestId, "Organization invitation email sent successfully", {
			inviteeEmail: data.email,
			organizationName: data.organization.name,
		});
	} catch (error) {
		logger.error(requestId, "Failed to send organization invitation email", error);

		/**
		 * Re-throwing the error to break the better auth flow as sending the invitation email
		 * is a critical part of the invitation creation process.
		 */
		throw error;
	}
}

/**
 * Handle sending password reset emails.
 *
 * @param data - Password reset data from better-auth
 * @param request - Optional request object for context
 */
async function handlePasswordResetEmail(
	data: PasswordResetEmailData,
	request?: Request
): Promise<void> {
	const cfg = getEmailConfig();
	const logger = cfg.logger || consoleLogger;
	const requestId = getRequestId(request);

	try {
		logger.info(requestId, "Handling password reset email", {
			userEmail: data.user.email,
		});

		// Calculate expiration date (default: 1 hour from now)
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

		// Render React email template to HTML
		const html = await renderBetterAuthPasswordResetEmail({
			name: data.user.name,
			email: data.user.email,
			resetUrl: data.url,
			expiresAt,
			appName: cfg.appName || "PluteoJS",
		});

		// Render plain text version
		const text = await renderBetterAuthPasswordResetEmail(
			{
				name: data.user.name,
				email: data.user.email,
				resetUrl: data.url,
				expiresAt,
				appName: cfg.appName || "PluteoJS",
			},
			{plainText: true}
		);

		const subject = `Reset your password for ${cfg.appName || "PluteoJS"}`;

		// Send email
		await cfg.sender({
			from: cfg.fromAddress,
			to: data.user.email,
			subject,
			html,
			text,
			metadata: {
				type: "password_reset",
				userId: data.user.id,
				userEmail: data.user.email,
				userName: data.user.name,
				resetUrl: data.url,
				token: data.token,
				expiresAt: expiresAt.toISOString(),
				requestId,
			},
		});

		logger.info(requestId, "Password reset email sent successfully", {
			userEmail: data.user.email,
		});
	} catch (error) {
		logger.error(requestId, "Failed to send password reset email", error);

		/**
		 * Re-throwing the error to break the better auth flow as sending the password reset email
		 * is a critical part of the password reset process.
		 */
		throw error;
	}
}

/**
 * Email handlers for better-auth callbacks.
 */
const emailHandlers = {
	handleSendVerificationEmail,
	handleOrgInviteEmail,
	handlePasswordResetEmail,
};

export default emailHandlers;
