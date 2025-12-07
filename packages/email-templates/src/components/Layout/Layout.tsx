import {Body, Container, Head, Html, Preview} from "@react-email/components";
import type {ReactNode} from "react";

import {Footer} from "../Footer";
import {Header} from "../Header";

interface iLayoutProps {
	preview: string;
	children: ReactNode;
}

const bodyStyle: React.CSSProperties = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
	margin: 0,
	padding: 0,
};

const containerStyle: React.CSSProperties = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "20px 0 48px",
	marginBottom: "64px",
	maxWidth: "600px",
};

const mainStyle: React.CSSProperties = {
	padding: "0 48px",
};

export function Layout({preview, children}: iLayoutProps): React.ReactElement {
	return (
		<Html>
			<Head />
			<Preview>{preview}</Preview>
			<Body style={bodyStyle}>
				<Container style={containerStyle}>
					<Header />
					<div style={mainStyle}>{children}</div>
					<Footer />
				</Container>
			</Body>
		</Html>
	);
}

export default Layout;
