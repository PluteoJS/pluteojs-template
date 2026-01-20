/**
 * Default allowed endpoints for better-auth.
 * Only these endpoints will be accessible; others return 404.
 *
 * Format: { "/path": ["METHOD1", "METHOD2"] }
 */
export const defaultAllowedEndpoints: Record<string, string[]> = {
	// Core authentication
	"/auth/sign-up/email": ["POST"],
	"/auth/sign-in/email": ["POST"],
	"/auth/sign-out": ["POST"],
	"/auth/get-session": ["GET"],

	// Email verification
	"/auth/verify-email": ["GET", "POST"],
	"/auth/send-verification-email": ["POST"],

	// Password reset
	"/auth/forget-password": ["POST"],
	"/auth/reset-password": ["POST"],

	// JWT & Token
	"/auth/token": ["GET"],
	"/auth/jwks": ["GET"],

	// Organization management
	"/auth/organization/create": ["POST"],
	"/auth/organization/list": ["GET"],
	"/auth/organization/get-full-organization": ["GET"],
	"/auth/organization/set-active": ["POST"],
	"/auth/organization/update": ["POST"],
	"/auth/organization/delete": ["POST"],

	// Organization invitations
	"/auth/organization/invite-member": ["POST"],
	"/auth/organization/accept-invitation": ["POST"],
	"/auth/organization/reject-invitation": ["POST"],
	"/auth/organization/cancel-invitation": ["POST"],
	"/auth/organization/get-invitation": ["GET"],

	// Organization members
	"/auth/organization/remove-member": ["POST"],
	"/auth/organization/update-member-role": ["POST"],

	// Team management
	"/auth/organization/create-team": ["POST"],
	"/auth/organization/list-teams": ["GET"],
	"/auth/organization/update-team": ["POST"],
	"/auth/organization/remove-team": ["POST"],
	"/auth/organization/add-team-member": ["POST"],
	"/auth/organization/remove-team-member": ["POST"],
	"/auth/organization/add-team-members": ["POST"],
};

/**
 * Check if an endpoint is allowed based on the allowlist.
 *
 * @param path - The request path (e.g., "/auth/sign-in/email")
 * @param method - The HTTP method (e.g., "POST")
 * @param customAllowlist - Optional custom allowlist (defaults to defaultAllowedEndpoints)
 * @returns true if the endpoint is allowed, false otherwise
 */
export function isEndpointAllowed(
	path: string,
	method: string,
	customAllowlist?: Record<string, string[]>
): boolean {
	const allowlist = customAllowlist ?? defaultAllowedEndpoints;

	// Empty allowlist = allow all (for development convenience)
	if (Object.keys(allowlist).length === 0) {
		return true;
	}

	// Normalize path: remove trailing slash, handle /api prefix
	const normalizedPath = path.replace(/\/$/, "").replace(/^\/api/, "");

	// Check exact match
	if (allowlist[normalizedPath]?.includes(method)) {
		return true;
	}

	// Check wildcard patterns (e.g., "/auth/organization/*")
	for (const [pattern, methods] of Object.entries(allowlist)) {
		if (pattern.endsWith("/*")) {
			const prefix = pattern.slice(0, -2);
			if (normalizedPath.startsWith(prefix) && methods.includes(method)) {
				return true;
			}
		}
	}

	return false;
}
