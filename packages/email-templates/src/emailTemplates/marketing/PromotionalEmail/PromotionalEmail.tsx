import {Link, Section, Text} from "@react-email/components";

import {Layout} from "../../../components/Layout";
import {Button} from "../../../components/Button";
import type {iPromotionalEmailProps} from "../../../customTypes";

const greetingStyle: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "26px",
	color: "#525f7f",
};

const promotionTitleStyle: React.CSSProperties = {
	fontSize: "32px",
	fontWeight: "bold",
	color: "#1a1a1a",
	textAlign: "center",
	marginBottom: "16px",
};

const promotionDescriptionStyle: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "26px",
	color: "#525f7f",
	textAlign: "center",
	marginBottom: "24px",
};

const discountContainerStyle: React.CSSProperties = {
	backgroundColor: "#556cd6",
	padding: "32px",
	textAlign: "center",
	margin: "24px 0",
};

const discountPercentageStyle: React.CSSProperties = {
	fontSize: "64px",
	fontWeight: "bold",
	color: "#ffffff",
	margin: "0 0 8px 0",
};

const discountLabelStyle: React.CSSProperties = {
	fontSize: "18px",
	color: "#ffffff",
	margin: 0,
	textTransform: "uppercase",
	letterSpacing: "2px",
};

const codeContainerStyle: React.CSSProperties = {
	backgroundColor: "#f4f4f4",
	padding: "16px",
	textAlign: "center",
	margin: "24px 0",
};

const codeLabelStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#8898aa",
	textTransform: "uppercase",
	margin: "0 0 8px 0",
};

const codeStyle: React.CSSProperties = {
	fontSize: "24px",
	fontWeight: "bold",
	color: "#1a1a1a",
	letterSpacing: "4px",
	margin: 0,
};

const expiryStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#8898aa",
	textAlign: "center",
	marginTop: "16px",
};

const ctaContainerStyle: React.CSSProperties = {
	textAlign: "center",
	margin: "32px 0",
};

const dividerStyle: React.CSSProperties = {
	borderTop: "1px solid #e6ebf1",
	margin: "32px 0",
};

const unsubscribeStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#8898aa",
	textAlign: "center",
};

const unsubscribeLinkStyle: React.CSSProperties = {
	color: "#556cd6",
};

export function PromotionalEmail({
	firstName,
	promotionTitle,
	promotionDescription,
	discountCode,
	discountPercentage,
	expiryDate,
	ctaText,
	ctaUrl,
	unsubscribeUrl,
}: iPromotionalEmailProps): React.ReactElement {
	const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

	return (
		<Layout preview={promotionTitle}>
			<Section>
				<Text style={greetingStyle}>{greeting}</Text>

				{/* Promotion Title */}
				<Text style={promotionTitleStyle}>{promotionTitle}</Text>
				<Text style={promotionDescriptionStyle}>{promotionDescription}</Text>

				{/* Discount Badge */}
				{discountPercentage && (
					<Section style={discountContainerStyle}>
						<Text style={discountPercentageStyle}>{discountPercentage}%</Text>
						<Text style={discountLabelStyle}>Off</Text>
					</Section>
				)}

				{/* Discount Code */}
				{discountCode && (
					<Section style={codeContainerStyle}>
						<Text style={codeLabelStyle}>Use Code</Text>
						<Text style={codeStyle}>{discountCode}</Text>
					</Section>
				)}

				{/* Expiry Date */}
				{expiryDate && (
					<Text style={expiryStyle}>
						Offer expires on {expiryDate}. Don&apos;t miss out!
					</Text>
				)}

				{/* CTA Button */}
				<Section style={ctaContainerStyle}>
					<Button href={ctaUrl}>{ctaText}</Button>
				</Section>

				{/* Divider */}
				<div style={dividerStyle} />

				{/* Unsubscribe */}
				<Text style={unsubscribeStyle}>
					You are receiving this email because you opted in to receive promotional emails.
					<br />
					<Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
						Unsubscribe
					</Link>{" "}
					from promotional emails.
				</Text>
			</Section>
		</Layout>
	);
}

PromotionalEmail.PreviewProps = {
	firstName: "John",
	promotionTitle: "Black Friday Sale!",
	promotionDescription:
		"Our biggest sale of the year is here! Get amazing discounts on all our products for a limited time only.",
	discountCode: "BLACKFRI25",
	discountPercentage: 25,
	expiryDate: "December 31, 2025",
	ctaText: "Shop Now",
	ctaUrl: "https://example.com/shop",
	unsubscribeUrl: "https://example.com/unsubscribe",
} satisfies iPromotionalEmailProps;

export default PromotionalEmail;
