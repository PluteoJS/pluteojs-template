import {Section, Text} from "@react-email/components";

import {Layout} from "../../../components/Layout";
import type {iWelcomeEmailProps} from "../../../customTypes";

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

export function WelcomeEmail({
	firstName,
	appName = "PluteoJS",
}: iWelcomeEmailProps): React.ReactElement {
	return (
		<Layout preview={`Welcome to ${appName}, ${firstName}!`}>
			<Section>
				<Text style={headingStyle}>Welcome to {appName}!</Text>
				<Text style={paragraphStyle}>Hi {firstName},</Text>
				<Text style={paragraphStyle}>
					Thank you for joining {appName}. We are excited to have you on board!
				</Text>
				<Text style={paragraphStyle}>
					If you have any questions, feel free to reach out to our support team.
				</Text>
			</Section>
		</Layout>
	);
}

WelcomeEmail.PreviewProps = {
	firstName: "John",
	appName: "PluteoJS",
} satisfies iWelcomeEmailProps;

export default WelcomeEmail;
