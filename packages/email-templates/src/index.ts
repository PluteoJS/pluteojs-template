/**
 * @pluteojs/email-templates
 *
 * React-email based email templates and rendering utilities for the PluteoJS monorepo.
 * This package exports render utilities and types only - React components are internal.
 */

// Render utilities (main API for consumers)
export {
	// Auth (OTP-based)
	renderWelcomeEmail,
	renderEmailVerificationEmail,
	// Better Auth (link-based)
	renderBetterAuthEmailVerificationEmail,
	renderBetterAuthPasswordResetEmail,
	renderOrganizationInvitationEmail,
	// Transactional
	renderOrderConfirmationEmail,
	renderPaymentReceiptEmail,
	// Marketing
	renderNewsletterEmail,
	renderPromotionalEmail,
} from "./utils";

// Types only (no React components exported)
export type {
	// Auth types (OTP-based)
	iWelcomeEmailProps,
	iEmailVerificationEmailProps,
	// Better Auth types (link-based)
	iBetterAuthEmailVerificationEmailProps,
	iBetterAuthPasswordResetEmailProps,
	iOrganizationInvitationEmailProps,
	// Transactional types
	iOrderItem,
	iOrderConfirmationEmailProps,
	iPaymentReceiptEmailProps,
	// Marketing types
	iNewsletterEmailProps,
	iPromotionalEmailProps,
	// Render options
	iRenderOptions,
} from "./customTypes";
