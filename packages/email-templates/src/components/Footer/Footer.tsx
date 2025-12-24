import {Hr, Link, Section, Text} from "@react-email/components";

interface iFooterProps {
	companyName?: string;
	supportEmail?: string;
}

const footerStyle: React.CSSProperties = {
	padding: "0 48px",
};

const hrStyle: React.CSSProperties = {
	borderColor: "#e6ebf1",
	margin: "20px 0",
};

const footerTextStyle: React.CSSProperties = {
	color: "#525f7f",
	fontSize: "14px",
	lineHeight: "24px",
};

const footerSmallTextStyle: React.CSSProperties = {
	color: "#8898aa",
	fontSize: "12px",
};

const linkStyle: React.CSSProperties = {
	color: "#556cd6",
};

export function Footer({
	companyName = "PluteoJS",
	supportEmail = "support@pluteojs.com",
}: iFooterProps): React.ReactElement {
	return (
		<Section style={footerStyle}>
			<Hr style={hrStyle} />
			<Text style={footerTextStyle}>
				Best,
				<br />
				Team {companyName}
			</Text>
			<Text style={footerSmallTextStyle}>
				Questions? Contact us at{" "}
				<Link href={`mailto:${supportEmail}`} style={linkStyle}>
					{supportEmail}
				</Link>
			</Text>
		</Section>
	);
}

export default Footer;
