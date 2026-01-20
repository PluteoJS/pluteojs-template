/**
 * Runtime Better Auth configuration.
 *
 * This file creates the actual better-auth instance with:
 * - Database connection from @pluteojs/database
 * - Environment-based configuration
 * - All plugins from shared config
 */
import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@pluteojs/database";
import * as schema from "@pluteojs/database/schema";

import config from "@/config/index.js";
import {betterAuthSharedConfig, corePlugins, devPlugins} from "./auth.shared.js";

/**
 * Determine which plugins to use based on environment.
 * Returns core plugins in production, core + dev plugins otherwise.
 */
const getPlugins = () => {
	if (process.env.NODE_ENV === "production") {
		return [...corePlugins];
	}
	return [...corePlugins, ...devPlugins];
};

/**
 * The main better-auth instance.
 * Import this in your Express/Hono routes.
 */
export const auth = betterAuth({
	// Base configuration from environment
	baseURL: config.betterAuth.baseURL,
	basePath: config.betterAuth.basePath,
	secret: config.betterAuth.secret,

	// Database adapter using existing Drizzle instance
	database: drizzleAdapter(db, {
		...betterAuthSharedConfig.drizzleAdapterConfig,
		schema: schema,
	}),

	// Email and password settings
	emailAndPassword: betterAuthSharedConfig.emailAndPassword,

	// Email verification settings
	emailVerification: betterAuthSharedConfig.emailVerification,

	// Plugins
	plugins: getPlugins(),

	// Advanced settings
	advanced: {
		...betterAuthSharedConfig.advanced,
		defaultCookieAttributes: {
			secure: config.betterAuth.cookies.secure,
			httpOnly: true,
			sameSite: config.betterAuth.cookies.sameSite,
			path: "/",
		},
	},
});

/**
 * Export the auth type for type inference.
 */
export type Auth = typeof auth;
