/**
 * Shared Better Auth configuration.
 *
 * CRITICAL: This file must NOT use path aliases (like @/).
 * The better-auth CLI uses jiti which doesn't resolve TypeScript path aliases.
 * Use relative imports only.
 */
import type {BetterAuthOptions} from "better-auth";
import {jwt, bearer, openAPI, organization} from "better-auth/plugins";
import type {DrizzleAdapterConfig} from "better-auth/adapters/drizzle";

// Import using relative paths (NO path aliases!)
import emailHandlers from "./email/handlers.js";
import {accessControl, roles} from "./permissions/accessControl.js";

/**
 * Extended better-auth options with Drizzle adapter config.
 */
interface BetterAuthSharedConfig extends BetterAuthOptions {
	drizzleAdapterConfig: DrizzleAdapterConfig;
}

/**
 * Core plugins that are always enabled.
 */
export const corePlugins = [
	// JWT plugin for token-based authentication
	jwt(),

	// Bearer token plugin with signature requirement
	bearer({
		requireSignature: true,
	}),

	// Organization plugin for multi-tenancy
	organization({
		// Organization creation settings
		allowUserToCreateOrganization: true,
		organizationLimit: 5,
		creatorRole: "owner",

		// Membership settings
		membershipLimit: 50,

		// Team settings
		teams: {
			enabled: true,
			defaultTeam: {enabled: false},
			maximumTeams: 10,
			maximumMembersPerTeam: 50,
		},

		// Invitation settings
		invitationLimit: 50,
		cancelPendingInvitationsOnReInvite: true,
		requireEmailVerificationOnInvitation: false, // Set to true in production

		// Access control
		ac: accessControl,
		roles: roles,

		// Email handlers
		sendInvitationEmail: emailHandlers.handleOrgInviteEmail,
	}),
];

/**
 * Development-only plugins.
 * These are added when NODE_ENV !== "production".
 */
export const devPlugins = [openAPI()];

/**
 * Shared configuration for better-auth.
 * This is used by both the runtime and CLI configurations.
 */
export const betterAuthSharedConfig: BetterAuthSharedConfig = {
	// Email and password authentication
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 8,
	},

	// Email verification settings
	emailVerification: {
		sendVerificationEmail: emailHandlers.handleSendVerificationEmail,
		sendOnSignUp: true,
	},

	// Drizzle adapter configuration
	drizzleAdapterConfig: {
		provider: "pg",
		usePlural: true,
		debugLogs: false,
	},

	// Advanced settings
	advanced: {
		database: {
			// CRITICAL: Disable better-auth's ID generation.
			// We use PostgreSQL's gen_random_uuid() instead.
			generateId: false,
		},
	},
};
