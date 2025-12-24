import {Button as ReactEmailButton} from "@react-email/components";
import type {ReactNode} from "react";

interface iButtonProps {
	href: string;
	children: ReactNode;
}

const buttonStyle: React.CSSProperties = {
	backgroundColor: "#556cd6",
	borderRadius: "5px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center",
	display: "block",
	padding: "12px 24px",
};

export function Button({href, children}: iButtonProps): React.ReactElement {
	return (
		<ReactEmailButton style={buttonStyle} href={href}>
			{children}
		</ReactEmailButton>
	);
}

export default Button;
