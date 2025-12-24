import {render} from "@react-email/render";

// Auth templates
import {EmailVerificationEmail} from "../emailTemplates/auth/EmailVerificationEmail";
import {PasswordResetEmail} from "../emailTemplates/auth/PasswordResetEmail";
import {WelcomeEmail} from "../emailTemplates/auth/WelcomeEmail";

// Transactional templates
import {OrderConfirmationEmail} from "../emailTemplates/transactional/OrderConfirmationEmail";
import {PaymentReceiptEmail} from "../emailTemplates/transactional/PaymentReceiptEmail";

// Marketing templates
import {NewsletterEmail} from "../emailTemplates/marketing/NewsletterEmail";
import {PromotionalEmail} from "../emailTemplates/marketing/PromotionalEmail";

import type {
	// Auth types
	iEmailVerificationEmailProps,
	iPasswordResetEmailProps,
	iWelcomeEmailProps,
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
 * Renders the PasswordResetEmail template to HTML or plain text string
 */
export async function renderPasswordResetEmail(
	props: iPasswordResetEmailProps,
	options?: iRenderOptions
): Promise<string> {
	return render(PasswordResetEmail(props), {plainText: options?.plainText});
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
