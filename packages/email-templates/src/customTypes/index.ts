// ============================================================================
// Auth Email Props
// ============================================================================

/**
 * Props for WelcomeEmail template
 */
export interface iWelcomeEmailProps {
	firstName: string;
	appName?: string;
}

/**
 * Props for PasswordResetEmail template
 */
export interface iPasswordResetEmailProps {
	firstName: string;
	otp: string;
	clientIp?: string | null;
	expirationMinutes?: number;
}

/**
 * Props for EmailVerificationEmail template
 */
export interface iEmailVerificationEmailProps {
	otp: string;
	clientIp?: string | null;
	expirationMinutes?: number;
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
