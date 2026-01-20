// Auth templates (OTP-based)
export {WelcomeEmail, PasswordResetEmail, EmailVerificationEmail} from "./auth";

// Better Auth templates (link-based)
export {
	BetterAuthEmailVerificationEmail,
	BetterAuthPasswordResetEmail,
	OrganizationInvitationEmail,
} from "./betterAuth";

// Transactional templates
export {OrderConfirmationEmail, PaymentReceiptEmail} from "./transactional";

// Marketing templates
export {NewsletterEmail, PromotionalEmail} from "./marketing";
