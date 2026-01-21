import type {Request, Response, Application} from "express";

import {apiDocsConfig, type iApiVersionDoc} from "@config/docsConfig";

/**
 * Generates the status badge HTML for a version.
 */
function getStatusBadge(status: iApiVersionDoc["status"]): string {
	const badges = {
		current: {color: "#166534", bgColor: "#dcfce7", label: "CURRENT"},
		deprecated: {color: "#9a3412", bgColor: "#ffedd5", label: "DEPRECATED"},
		beta: {color: "#1e40af", bgColor: "#dbeafe", label: "BETA"},
	} as const;

	const badge = badges[status];
	return `<span style="
		display: inline-block;
		padding: 4px 12px;
		border-radius: 9999px;
		font-size: 12px;
		font-weight: 600;
		color: ${badge.color};
		background-color: ${badge.bgColor};
		text-transform: uppercase;
		letter-spacing: 0.05em;
	">${badge.label}</span>`;
}

/**
 * Generates the HTML for a version card.
 */
function generateVersionCard(version: iApiVersionDoc): string {
	return `
		<div style="
			background: white;
			border: 1px solid #e5e7eb;
			border-radius: 12px;
			padding: 24px;
			margin-bottom: 16px;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		">
			<div style="
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;
			">
				<h2 style="
					margin: 0;
					font-size: 20px;
					font-weight: 600;
					color: #111827;
				">API ${version.version}</h2>
				${getStatusBadge(version.status)}
			</div>
			${version.description ? `<p style="
				margin: 0 0 20px 0;
				color: #6b7280;
				font-size: 14px;
			">${version.description}</p>` : ""}
			<div style="
				display: flex;
				gap: 12px;
				flex-wrap: wrap;
			">
				<a href="${version.apiDocsPath}" style="
					display: inline-flex;
					align-items: center;
					padding: 10px 20px;
					background-color: #2563eb;
					color: white;
					text-decoration: none;
					border-radius: 8px;
					font-size: 14px;
					font-weight: 500;
					transition: background-color 0.2s;
				" onmouseover="this.style.backgroundColor='#1d4ed8'" onmouseout="this.style.backgroundColor='#2563eb'">
					<svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
					</svg>
					API Reference
				</a>
				<a href="${version.authDocsPath}" style="
					display: inline-flex;
					align-items: center;
					padding: 10px 20px;
					background-color: #059669;
					color: white;
					text-decoration: none;
					border-radius: 8px;
					font-size: 14px;
					font-weight: 500;
					transition: background-color 0.2s;
				" onmouseover="this.style.backgroundColor='#047857'" onmouseout="this.style.backgroundColor='#059669'">
					<svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
					</svg>
					Authentication Docs
				</a>
			</div>
			<p style="
				margin: 16px 0 0 0;
				font-size: 13px;
				color: #6b7280;
			">
				<svg style="width: 14px; height: 14px; vertical-align: middle; margin-right: 4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				Not all authentication endpoints shown may be enabled.
				See <code style="
					background-color: #f3f4f6;
					padding: 2px 6px;
					border-radius: 4px;
					font-size: 12px;
				">packages/better-auth/README.md#endpoint-security</code>
			</p>
			<div style="
				margin-top: 16px;
				padding-top: 16px;
				border-top: 1px solid #f3f4f6;
				display: flex;
				gap: 24px;
				font-size: 12px;
				color: #9ca3af;
			">
				<span>${version.apiDocsPath}</span>
				<span>${version.authDocsPath}</span>
			</div>
		</div>
	`;
}

/**
 * Generates the full HTML page for the documentation hub.
 */
function generateHubPage(): string {
	const versionCards = apiDocsConfig.map(generateVersionCard).join("");

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>PluteoJS API Documentation</title>
	<style>
		* {
			box-sizing: border-box;
		}
		body {
			margin: 0;
			padding: 0;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			background-color: #f9fafb;
			color: #111827;
			line-height: 1.5;
		}
	</style>
</head>
<body>
	<div style="
		min-height: 100vh;
		padding: 40px 20px;
	">
		<div style="
			max-width: 800px;
			margin: 0 auto;
		">
			<header style="
				text-align: center;
				margin-bottom: 48px;
			">
				<h1 style="
					margin: 0 0 16px 0;
					font-size: 32px;
					font-weight: 700;
					color: #111827;
				">PluteoJS API Documentation</h1>
				<p style="
					margin: 0;
					color: #6b7280;
					font-size: 16px;
				">Select an API version to view its documentation</p>
			</header>

			<main>
				${versionCards}
			</main>

			<footer style="
				margin-top: 48px;
				text-align: center;
				color: #9ca3af;
				font-size: 14px;
			">
				<p style="margin: 0;">
					Built with <a href="https://github.com/PluteoJS/pluteojs-template" style="color: #2563eb; text-decoration: none;">PluteoJS</a>
				</p>
			</footer>
		</div>
	</div>
</body>
</html>`;
}

/**
 * Mounts the documentation hub route at /api/docs.
 *
 * @param app - Express application instance
 */
export function mountDocsHub(app: Application): void {
	app.get("/api/docs", (req: Request, res: Response) => {
		void req; // unused
		res.setHeader("Content-Type", "text/html");
		res.send(generateHubPage());
	});
}

export default mountDocsHub;
