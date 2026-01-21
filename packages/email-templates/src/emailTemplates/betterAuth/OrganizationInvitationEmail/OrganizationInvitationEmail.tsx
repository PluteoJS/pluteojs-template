import {Img, Section, Text} from "@react-email/components";

import {Button} from "../../../components/Button";
import {Layout} from "../../../components/Layout";
import type {iOrganizationInvitationEmailProps} from "../../../customTypes";

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

const highlightStyle: React.CSSProperties = {
	fontWeight: "600",
	color: "#1a1a1a",
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

const roleBadgeStyle: React.CSSProperties = {
	display: "inline-block",
	padding: "4px 12px",
	borderRadius: "4px",
	fontSize: "14px",
	fontWeight: "600",
	textTransform: "capitalize",
};

const logoContainerStyle: React.CSSProperties = {
	textAlign: "center",
	margin: "24px 0",
};

const logoStyle: React.CSSProperties = {
	borderRadius: "8px",
};

/**
 * Helper function to format role for display
 */
function formatRole(role: string): string {
	return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

/**
 * Helper function to get role badge background color
 */
function getRoleBadgeColor(role: string): string {
	switch (role.toLowerCase()) {
		case "owner":
			return "#7c3aed";
		case "admin":
			return "#2563eb";
		default:
			return "#059669";
	}
}

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

export function OrganizationInvitationEmail({
	inviteeEmail,
	inviterName,
	organizationName,
	role,
	invitationUrl,
	expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000), // Default 48 hours
	organizationLogo,
	appName = "PluteoJS",
}: iOrganizationInvitationEmailProps): React.ReactElement {
	return (
		<Layout preview={`You've been invited to join ${organizationName}`}>
			<Section>
				<Text style={headingStyle}>Organization Invitation</Text>

				{organizationLogo && (
					<Section style={logoContainerStyle}>
						<Img
							src={organizationLogo}
							alt={organizationName}
							width="64"
							height="64"
							style={logoStyle}
						/>
					</Section>
				)}

				<Text style={paragraphStyle}>Hi,</Text>
				<Text style={paragraphStyle}>
					<span style={highlightStyle}>{inviterName}</span> has invited you to
					join <span style={highlightStyle}>{organizationName}</span> on{" "}
					{appName}.
				</Text>

				<Section style={detailsContainerStyle}>
					<Text style={detailLabelStyle}>Your role will be:</Text>
					<div
						style={{
							...roleBadgeStyle,
							backgroundColor: getRoleBadgeColor(role),
							color: "#ffffff",
						}}
					>
						{formatRole(role)}
					</div>
				</Section>

				<Section style={{textAlign: "center", margin: "32px 0"}}>
					<Button href={invitationUrl}>Accept Invitation</Button>
				</Section>

				<Text style={paragraphStyle}>
					This invitation will expire in{" "}
					<strong>{getTimeRemaining(expiresAt)}</strong>.
				</Text>

				<Section style={detailsContainerStyle}>
					<Text style={detailLabelStyle}>Invitation Details:</Text>
					<Text style={detailValueStyle}>Organization: {organizationName}</Text>
					<Text style={detailValueStyle}>Invited by: {inviterName}</Text>
					<Text style={detailValueStyle}>Your email: {inviteeEmail}</Text>
					<Text style={detailValueStyle}>Role: {formatRole(role)}</Text>
					<Text style={detailValueStyle}>
						Expires: {expiresAt.toLocaleDateString()}
					</Text>
				</Section>

				<Text style={paragraphStyle}>
					If the button above doesn&apos;t work, you can copy and paste the
					following link into your browser:
				</Text>
				<Section style={linkContainerStyle}>
					<Text style={linkStyle}>{invitationUrl}</Text>
				</Section>

				<Text style={infoStyle}>
					If you weren&apos;t expecting this invitation or don&apos;t recognize
					the sender, you can safely ignore this email. The invitation will
					expire automatically.
				</Text>
			</Section>
		</Layout>
	);
}

OrganizationInvitationEmail.PreviewProps = {
	inviteeEmail: "user@example.com",
	inviterName: "John Doe",
	organizationName: "Acme Corporation",
	role: "member",
	invitationUrl: "https://example.com/accept-invitation/abc123",
	expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
	organizationLogo: undefined,
	appName: "PluteoJS",
} satisfies iOrganizationInvitationEmailProps;

export default OrganizationInvitationEmail;
