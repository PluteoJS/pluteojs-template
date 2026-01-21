import {Section, Text} from "@react-email/components";

import {Button} from "../../../components/Button";
import {Layout} from "../../../components/Layout";
import type {iBetterAuthPasswordResetEmailProps} from "../../../customTypes";

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

const warningContainerStyle: React.CSSProperties = {
	backgroundColor: "#fef2f2",
	padding: "16px",
	margin: "24px 0",
	borderRadius: "8px",
	border: "1px solid #fecaca",
};

const warningStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#991b1b",
	margin: 0,
};

const infoStyle: React.CSSProperties = {
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
	const minutes = Math.floor(diff / (1000 * 60));

	if (minutes < 60) return `${minutes} minutes`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
	const days = Math.floor(hours / 24);
	return `${days} ${days === 1 ? "day" : "days"}`;
}

export function BetterAuthPasswordResetEmail({
	name,
	email,
	resetUrl,
	expiresAt = new Date(Date.now() + 60 * 60 * 1000), // Default 1 hour
	appName = "PluteoJS",
}: iBetterAuthPasswordResetEmailProps): React.ReactElement {
	const firstName = name ? name.split(" ")[0] : undefined;

	return (
		<Layout preview={`Reset your password for ${appName}`}>
			<Section>
				<Text style={headingStyle}>Password Reset Request</Text>
				<Text style={paragraphStyle}>
					{firstName ? `Hi ${firstName},` : "Hi,"}
				</Text>
				<Text style={paragraphStyle}>
					We received a request to reset the password for your {appName}{" "}
					account. Click the button below to set a new password.
				</Text>

				<Section style={{textAlign: "center", margin: "32px 0"}}>
					<Button href={resetUrl}>Reset Password</Button>
				</Section>

				<Text style={paragraphStyle}>
					This password reset link will expire in{" "}
					<strong>{getTimeRemaining(expiresAt)}</strong>.
				</Text>

				<Section style={detailsContainerStyle}>
					<Text style={detailLabelStyle}>Request Details:</Text>
					<Text style={detailValueStyle}>Email: {email}</Text>
					<Text style={detailValueStyle}>
						Expires: {expiresAt.toLocaleString()}
					</Text>
				</Section>

				<Text style={paragraphStyle}>
					If the button above doesn&apos;t work, you can copy and paste the
					following link into your browser:
				</Text>
				<Section style={linkContainerStyle}>
					<Text style={linkStyle}>{resetUrl}</Text>
				</Section>

				<Section style={warningContainerStyle}>
					<Text style={warningStyle}>
						If you did not request a password reset, please ignore this email or
						contact support immediately if you believe your account has been
						compromised. Your password will remain unchanged.
					</Text>
				</Section>

				<Text style={infoStyle}>
					For security reasons, this link can only be used once and will expire
					automatically.
				</Text>
			</Section>
		</Layout>
	);
}

BetterAuthPasswordResetEmail.PreviewProps = {
	name: "John Doe",
	email: "john.doe@example.com",
	resetUrl: "https://example.com/reset-password?token=abc123xyz",
	expiresAt: new Date(Date.now() + 60 * 60 * 1000),
	appName: "PluteoJS",
} satisfies iBetterAuthPasswordResetEmailProps;

export default BetterAuthPasswordResetEmail;
