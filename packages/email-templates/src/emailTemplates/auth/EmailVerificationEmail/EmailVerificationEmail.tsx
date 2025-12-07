import {Section, Text} from "@react-email/components";

import {Layout} from "../../../components/Layout";
import type {iEmailVerificationEmailProps} from "../../../customTypes";

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

export function EmailVerificationEmail({
	otp,
	clientIp,
	expirationMinutes = 10,
}: iEmailVerificationEmailProps): React.ReactElement {
	return (
		<Layout preview="Verify Your Email Address">
			<Section>
				<Text style={headingStyle}>Verify Your Email Address</Text>
				<Text style={paragraphStyle}>Hi,</Text>
				<Text style={paragraphStyle}>
					We received an email verification request
					{clientIp ? ` from IP address ${clientIp}` : ""}.
				</Text>
				<Text style={paragraphStyle}>
					Please use the following OTP to verify your email address:
				</Text>
				<Section style={otpContainerStyle}>
					<Text style={otpStyle}>{otp}</Text>
				</Section>
				<Text style={paragraphStyle}>
					This code will expire in {expirationMinutes} minutes.
				</Text>
				<Text style={warningStyle}>
					If you did not request this verification, please ignore this email.
				</Text>
			</Section>
		</Layout>
	);
}

EmailVerificationEmail.PreviewProps = {
	otp: "789012",
	clientIp: "192.168.1.1",
	expirationMinutes: 10,
} satisfies iEmailVerificationEmailProps;

export default EmailVerificationEmail;
