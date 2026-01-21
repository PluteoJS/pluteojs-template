/**
 * @pluteojs/better-auth
 *
 * Centralized authentication package using better-auth.
 * Provides a configured auth instance for use across multiple backend frameworks.
 */

// Main auth export
export {auth} from "./auth.js";
export type {Auth} from "./auth.js";

// Configuration exports
export {default as config} from "./config/index.js";
export {isEndpointAllowed, defaultAllowedEndpoints} from "./config/allowedEndpoints.js";
export type {EnvConfig} from "./config/envSchema.js";

// Permission exports
export {accessControl, roles} from "./permissions/accessControl.js";

// Email handler exports
export {configureEmailHandlers} from "./email/handlers.js";
export type {
	iEmailSendOptions,
	EmailSenderFn,
	iEmailLogger,
} from "./email/handlers.js";

// Type exports
export type {
	AuthSession,
	ExtendedUser,
	ExtendedSession,
	OrganizationInviteEmailData,
	EmailVerificationData,
	PasswordResetEmailData,
} from "./types/index.js";

// Re-export useful types from better-auth
export type {Session, User} from "better-auth";
