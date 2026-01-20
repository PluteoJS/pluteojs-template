/**
 * CLI-only Better Auth configuration.
 *
 * CRITICAL: This file is used ONLY for schema generation via the better-auth CLI.
 * It must NOT use:
 * - Path aliases (like @/) - jiti doesn't resolve them
 *
 * Use relative imports only.
 */
import {db} from "@pluteojs/database";
import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {betterAuthSharedConfig, corePlugins, devPlugins} from "./auth.shared.js";

/**
 * For schema generation, include ALL plugins to ensure complete schema
 */
const plugins = [...corePlugins, ...devPlugins] as const;

/**
 * CLI configuration for schema generation.
 * This is referenced by the better-auth CLI command.
 */
const betterAuthCLIInstance: ReturnType<typeof betterAuth> = betterAuth({
	// Dummy values for CLI (not used at runtime)
	baseURL: "http://localhost:3000",
	basePath: "/api/auth",
	secret: "cli-dummy-secret-not-used-at-runtime-must-be-32-chars",

	// Use shared configuration
	emailAndPassword: betterAuthSharedConfig.emailAndPassword,

	emailVerification: betterAuthSharedConfig.emailVerification,

	database: drizzleAdapter(db, betterAuthSharedConfig.drizzleAdapterConfig),

	advanced: betterAuthSharedConfig.advanced,

	plugins: [...plugins],
});

export default betterAuthCLIInstance;
