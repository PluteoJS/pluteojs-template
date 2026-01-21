import {render} from "@react-email/render";

// Auth templates (OTP-based)
import {EmailVerificationEmail} from "../emailTemplates/auth/EmailVerificationEmail";
import {WelcomeEmail} from "../emailTemplates/auth/WelcomeEmail";

// Better Auth templates (link-based)
import {BetterAuthEmailVerificationEmail} from "../emailTemplates/betterAuth/BetterAuthEmailVerificationEmail";
import {BetterAuthPasswordResetEmail} from "../emailTemplates/betterAuth/BetterAuthPasswordResetEmail";
import {OrganizationInvitationEmail} from "../emailTemplates/betterAuth/OrganizationInvitationEmail";

// Transactional templates
import {OrderConfirmationEmail} from "../emailTemplates/transactional/OrderConfirmationEmail";
import {PaymentReceiptEmail} from "../emailTemplates/transactional/PaymentReceiptEmail";

// Marketing templates
import {NewsletterEmail} from "../emailTemplates/marketing/NewsletterEmail";
import {PromotionalEmail} from "../emailTemplates/marketing/PromotionalEmail";

import type {
	// Auth types (OTP-based)
	iEmailVerificationEmailProps,
	iWelcomeEmailProps,
	// Better Auth types (link-based)
	iBetterAuthEmailVerificationEmailProps,
	iBetterAuthPasswordResetEmailProps,
	iOrganizationInvitationEmailProps,
	// Transactional types
	iOrderConfirmationEmailProps,
	iPaymentReceiptEmailProps,
	// Marketing types
	iNewsletterEmailProps,
	iPromotionalEmailProps,
	// Render options
	iRenderOptions,
} from "../customTypes";

// ============================================================================
// Auth Email Render Functions
// ============================================================================

/**
 * Renders the WelcomeEmail template to HTML or plain text string
 */
export async function renderWelcomeEmail(
	props: iWelcomeEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(WelcomeEmail(props), {plainText: options?.plainText});
}

/**
 * Renders the EmailVerificationEmail template to HTML or plain text string
 */
export async function renderEmailVerificationEmail(
	props: iEmailVerificationEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(EmailVerificationEmail(props), {plainText: options?.plainText});
}

// ============================================================================
// Better Auth Email Render Functions (link-based)
// ============================================================================

/**
 * Renders the BetterAuthEmailVerificationEmail template to HTML or plain text string
 */
export async function renderBetterAuthEmailVerificationEmail(
	props: iBetterAuthEmailVerificationEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(BetterAuthEmailVerificationEmail(props), {
		plainText: options?.plainText,
	});
}

/**
 * Renders the BetterAuthPasswordResetEmail template to HTML or plain text string
 */
export async function renderBetterAuthPasswordResetEmail(
	props: iBetterAuthPasswordResetEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(BetterAuthPasswordResetEmail(props), {
		plainText: options?.plainText,
	});
}

/**
 * Renders the OrganizationInvitationEmail template to HTML or plain text string
 */
export async function renderOrganizationInvitationEmail(
	props: iOrganizationInvitationEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(OrganizationInvitationEmail(props), {
		plainText: options?.plainText,
	});
}

// ============================================================================
// Transactional Email Render Functions
// ============================================================================

/**
 * Renders the OrderConfirmationEmail template to HTML or plain text string
 */
export async function renderOrderConfirmationEmail(
	props: iOrderConfirmationEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(OrderConfirmationEmail(props), {plainText: options?.plainText});
}

/**
 * Renders the PaymentReceiptEmail template to HTML or plain text string
 */
export async function renderPaymentReceiptEmail(
	props: iPaymentReceiptEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(PaymentReceiptEmail(props), {plainText: options?.plainText});
}

// ============================================================================
// Marketing Email Render Functions
// ============================================================================

/**
 * Renders the NewsletterEmail template to HTML or plain text string
 */
export async function renderNewsletterEmail(
	props: iNewsletterEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(NewsletterEmail(props), {plainText: options?.plainText});
}

/**
 * Renders the PromotionalEmail template to HTML or plain text string
 */
export async function renderPromotionalEmail(
	props: iPromotionalEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(PromotionalEmail(props), {plainText: options?.plainText});
}
