/**
 * @pluteojs/email-templates
 *
 * React-email based email templates and rendering utilities for the PluteoJS monorepo.
 * This package exports render utilities and types only - React components are internal.
 */

// Render utilities (main API for consumers)
export {
	// Auth
	renderWelcomeEmail,
	renderPasswordResetEmail,
	renderEmailVerificationEmail,
	// Transactional
	renderOrderConfirmationEmail,
	renderPaymentReceiptEmail,
	// Marketing
	renderNewsletterEmail,
	renderPromotionalEmail,
} from "./utils";

// Types only (no React components exported)
export type {
	// Auth types
	iWelcomeEmailProps,
	iPasswordResetEmailProps,
	iEmailVerificationEmailProps,
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
