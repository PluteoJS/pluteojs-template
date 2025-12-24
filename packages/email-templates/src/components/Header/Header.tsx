import {Img, Section} from "@react-email/components";

/**
 * PluteoJS logo URL from the official brand-kit repository.
 * Using the white background version for maximum email client compatibility.
 */
const DEFAULT_LOGO_URL =
	"https://raw.githubusercontent.com/PluteoJS/brand-kit/main/pluteo-js-logo-white-bg.png";

interface iHeaderProps {
	logoUrl?: string;
	appName?: string;
}

const headerStyle: React.CSSProperties = {
	padding: "20px 48px",
	borderBottom: "1px solid #e6ebf1",
};

const logoStyle: React.CSSProperties = {
	display: "block",
	margin: "0 auto",
};

export function Header({
	logoUrl = DEFAULT_LOGO_URL,
	appName = "PluteoJS",
}: iHeaderProps): React.ReactElement {
	return (
		<Section style={headerStyle}>
			<Img
				src={logoUrl}
				alt={appName}
				width="150"
				height="auto"
				style={logoStyle}
			/>
		</Section>
	);
}

export default Header;
