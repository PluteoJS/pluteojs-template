import {Img, Link, Section, Text} from "@react-email/components";

import {Layout} from "../../../components/Layout";
import {Button} from "../../../components/Button";
import type {iNewsletterEmailProps} from "../../../customTypes";

const greetingStyle: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "26px",
	color: "#525f7f",
	marginBottom: "24px",
};

const heroImageStyle: React.CSSProperties = {
	width: "100%",
	marginBottom: "24px",
};

const heroTitleStyle: React.CSSProperties = {
	fontSize: "28px",
	fontWeight: "bold",
	color: "#1a1a1a",
	marginBottom: "16px",
	lineHeight: "36px",
};

const heroDescriptionStyle: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "26px",
	color: "#525f7f",
	marginBottom: "24px",
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

export function NewsletterEmail({
	firstName,
	previewText,
	heroImageUrl,
	heroTitle,
	heroDescription,
	ctaText = "Read More",
	ctaUrl,
	unsubscribeUrl,
}: iNewsletterEmailProps): React.ReactElement {
	const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

	return (
		<Layout preview={previewText}>
			<Section>
				<Text style={greetingStyle}>{greeting}</Text>

				{/* Hero Image */}
				{heroImageUrl && (
					<Img
						src={heroImageUrl}
						alt={heroTitle}
						style={heroImageStyle}
					/>
				)}

				{/* Hero Content */}
				<Text style={heroTitleStyle}>{heroTitle}</Text>
				<Text style={heroDescriptionStyle}>{heroDescription}</Text>

				{/* CTA Button */}
				{ctaUrl && (
					<Section style={ctaContainerStyle}>
						<Button href={ctaUrl}>{ctaText}</Button>
					</Section>
				)}

				{/* Divider */}
				<div style={dividerStyle} />

				{/* Unsubscribe */}
				<Text style={unsubscribeStyle}>
					You are receiving this email because you subscribed to our newsletter.
					<br />
					<Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
						Unsubscribe
					</Link>{" "}
					from future emails.
				</Text>
			</Section>
		</Layout>
	);
}

NewsletterEmail.PreviewProps = {
	firstName: "John",
	subject: "This Week in PluteoJS",
	previewText: "Discover the latest updates and features in PluteoJS",
	heroTitle: "Introducing Our Latest Features",
	heroDescription:
		"We have been working hard to bring you new features that will make your development experience even better. From improved performance to new integrations, there is a lot to explore in this update.",
	ctaText: "Explore New Features",
	ctaUrl: "https://example.com",
	unsubscribeUrl: "https://example.com/unsubscribe",
} satisfies iNewsletterEmailProps;

export default NewsletterEmail;
