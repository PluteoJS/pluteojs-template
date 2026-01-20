import {Section, Text} from "@react-email/components";

import {Button} from "../../../components/Button";
import {Layout} from "../../../components/Layout";
import type {iBetterAuthEmailVerificationEmailProps} from "../../../customTypes";

const headingStyle: React.CSSProperties = {
	fontSize: "24px",
	fontWeight: "bold",
	color: "#1a1a1a",
	marginBottom: "24px",
};

const paragraphStyle: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "26px",
	color: "#525f7f",
};

const linkContainerStyle: React.CSSProperties = {
	backgroundColor: "#f4f4f4",
	padding: "16px",
	margin: "24px 0",
	borderRadius: "8px",
	wordBreak: "break-all",
};

const linkStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#525f7f",
};

const warningStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#8898aa",
	fontStyle: "italic",
};

const detailsContainerStyle: React.CSSProperties = {
	backgroundColor: "#f9fafb",
	padding: "16px",
	margin: "24px 0",
	borderRadius: "8px",
	border: "1px solid #e5e7eb",
};

const detailLabelStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#6b7280",
	margin: "4px 0",
};

const detailValueStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#1a1a1a",
	fontWeight: "500",
	margin: "4px 0",
};

/**
 * Helper function to get time remaining until expiration
 */
function getTimeRemaining(expiresAt: Date): string {
	const now = new Date();
	const diff = expiresAt.getTime() - now.getTime();
	const hours = Math.floor(diff / (1000 * 60 * 60));

	if (hours < 1) return "less than 1 hour";
	if (hours < 24) return `${hours} hours`;
	const days = Math.floor(hours / 24);
	return `${days} ${days === 1 ? "day" : "days"}`;
}

export function BetterAuthEmailVerificationEmail({
	name,
	email,
	verificationUrl,
	expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000),
	appName = "PluteoJS",
}: iBetterAuthEmailVerificationEmailProps): React.ReactElement {
	const firstName = name ? name.split(" ")[0] : undefined;

	return (
		<Layout preview={`Verify your email address for ${appName}`}>
			<Section>
				<Text style={headingStyle}>Verify Your Email Address</Text>
				<Text style={paragraphStyle}>
					{firstName ? `Hi ${firstName},` : "Hi,"}
				</Text>
				<Text style={paragraphStyle}>
					Thank you for signing up for {appName}! To complete your registration
					and ensure the security of your account, please verify your email
					address by clicking the button below.
				</Text>

				<Section style={{textAlign: "center", margin: "32px 0"}}>
					<Button href={verificationUrl}>Verify Email Address</Button>
				</Section>

				<Text style={paragraphStyle}>
					This verification link will expire in{" "}
					<strong>{getTimeRemaining(expiresAt)}</strong>.
				</Text>

				<Section style={detailsContainerStyle}>
					<Text style={detailLabelStyle}>Verification Details:</Text>
					<Text style={detailValueStyle}>Email: {email}</Text>
					{name && <Text style={detailValueStyle}>Name: {name}</Text>}
					<Text style={detailValueStyle}>
						Expires: {expiresAt.toLocaleDateString()}
					</Text>
				</Section>

				<Text style={paragraphStyle}>
					If the button above doesn&apos;t work, you can copy and paste the
					following link into your browser:
				</Text>
				<Section style={linkContainerStyle}>
					<Text style={linkStyle}>{verificationUrl}</Text>
				</Section>

				<Text style={warningStyle}>
					If you did not create an account with {appName}, you can safely ignore
					this email. The verification link will expire automatically.
				</Text>
			</Section>
		</Layout>
	);
}

BetterAuthEmailVerificationEmail.PreviewProps = {
	name: "John Doe",
	email: "john.doe@example.com",
	verificationUrl: "https://example.com/verify-email?token=abc123xyz",
	expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
	appName: "PluteoJS",
} satisfies iBetterAuthEmailVerificationEmailProps;

export default BetterAuthEmailVerificationEmail;
