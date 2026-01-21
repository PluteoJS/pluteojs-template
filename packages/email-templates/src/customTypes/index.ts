// ============================================================================
// Auth Email Props (OTP-based)
// ============================================================================

/**
 * Props for WelcomeEmail template
 */
export interface iWelcomeEmailProps {
	firstName: string;
	appName?: string;
}

/**
 * Props for EmailVerificationEmail template (OTP-based)
 */
export interface iEmailVerificationEmailProps {
	otp: string;
	clientIp?: string | null;
	expirationMinutes?: number;
}

// ============================================================================
// Better Auth Email Props (Link-based)
// ============================================================================

/**
 * Props for BetterAuthEmailVerificationEmail template (link-based)
 */
export interface iBetterAuthEmailVerificationEmailProps {
	name: string;
	email: string;
	verificationUrl: string;
	expiresAt?: Date;
	appName?: string;
}

/**
 * Props for BetterAuthPasswordResetEmail template (link-based)
 */
export interface iBetterAuthPasswordResetEmailProps {
	name: string;
	email: string;
	resetUrl: string;
	expiresAt?: Date;
	appName?: string;
}

/**
 * Props for OrganizationInvitationEmail template
 */
export interface iOrganizationInvitationEmailProps {
	inviteeEmail: string;
	inviterName: string;
	organizationName: string;
	role: string;
	invitationUrl: string;
	expiresAt?: Date;
	organizationLogo?: string;
	appName?: string;
}

// ============================================================================
// Transactional Email Props
// ============================================================================

/**
 * Order item for OrderConfirmationEmail
 */
export interface iOrderItem {
	name: string;
	quantity: number;
	price: number;
}

/**
 * Props for OrderConfirmationEmail template
 */
export interface iOrderConfirmationEmailProps {
	firstName: string;
	orderId: string;
	orderDate: string;
	items: iOrderItem[];
	subtotal: number;
	shipping: number;
	total: number;
	shippingAddress: string;
	estimatedDelivery?: string;
}

/**
 * Props for PaymentReceiptEmail template
 */
export interface iPaymentReceiptEmailProps {
	firstName: string;
	receiptId: string;
	paymentDate: string;
	amount: number;
	currency?: string;
	paymentMethod: string;
	description: string;
}

// ============================================================================
// Marketing Email Props
// ============================================================================

/**
 * Props for NewsletterEmail template
 */
export interface iNewsletterEmailProps {
	firstName?: string;
	subject: string;
	previewText: string;
	heroImageUrl?: string;
	heroTitle: string;
	heroDescription: string;
	ctaText?: string;
	ctaUrl?: string;
	unsubscribeUrl: string;
}

/**
 * Props for PromotionalEmail template
 */
export interface iPromotionalEmailProps {
	firstName?: string;
	promotionTitle: string;
	promotionDescription: string;
	discountCode?: string;
	discountPercentage?: number;
	expiryDate?: string;
	ctaText: string;
	ctaUrl: string;
	unsubscribeUrl: string;
}

// ============================================================================
// Render Options
// ============================================================================

/**
 * Options for rendering email templates
 */
export interface iRenderOptions {
	plainText?: boolean;
}
