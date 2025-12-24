import {Section, Text} from "@react-email/components";

import {Layout} from "../../../components/Layout";
import type {iPasswordResetEmailProps} from "../../../customTypes";

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

const otpContainerStyle: React.CSSProperties = {
	backgroundColor: "#f4f4f4",
	padding: "24px",
	textAlign: "center",
	margin: "24px 0",
};

const otpStyle: React.CSSProperties = {
	fontSize: "32px",
	fontWeight: "bold",
	letterSpacing: "8px",
	color: "#1a1a1a",
	margin: 0,
};

const warningStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#8898aa",
	fontStyle: "italic",
};

export function PasswordResetEmail({
	firstName,
	otp,
	clientIp,
	expirationMinutes = 10,
}: iPasswordResetEmailProps): React.ReactElement {
	return (
		<Layout preview="Password Reset Request">
			<Section>
				<Text style={headingStyle}>Password Reset Request</Text>
				<Text style={paragraphStyle}>Hi {firstName},</Text>
				<Text style={paragraphStyle}>
					We received a password reset request for your account
					{clientIp ? ` from IP address ${clientIp}` : ""}.
				</Text>
				<Text style={paragraphStyle}>Your one-time password (OTP) is:</Text>
				<Section style={otpContainerStyle}>
					<Text style={otpStyle}>{otp}</Text>
				</Section>
				<Text style={paragraphStyle}>
					This code will expire in {expirationMinutes} minutes.
				</Text>
				<Text style={warningStyle}>
					If you did not request this password reset, please ignore this email
					or contact support if you have concerns.
				</Text>
			</Section>
		</Layout>
	);
}

PasswordResetEmail.PreviewProps = {
	firstName: "John",
	otp: "123456",
	clientIp: "192.168.1.1",
	expirationMinutes: 10,
} satisfies iPasswordResetEmailProps;

export default PasswordResetEmail;
