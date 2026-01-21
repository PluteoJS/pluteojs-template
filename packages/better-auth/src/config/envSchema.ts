import {z} from "zod";

/**
 * Environment schema for better-auth configuration.
 * Validates all required environment variables.
 */
export const envSchema = z.object({
	// Core better-auth settings
	BETTER_AUTH_SECRET: z.string().min(64, "Secret must be at least 64 characters"),
	BETTER_AUTH_BASE_URL: z.string().url("Must be a valid URL"),
	BETTER_AUTH_BASE_PATH: z.string().default("/api/auth"),

	// Cookie settings
	BETTER_AUTH_COOKIE_SECURE: z
		.enum(["true", "false"])
		.default("false")
		.transform((val) => val === "true"),
	BETTER_AUTH_COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),

	// Response envelope
	BETTER_AUTH_ENABLE_RESPONSE_ENVELOPE: z
		.enum(["true", "false"])
		.default("true")
		.transform((val) => val === "true"),

	// Database (inherited from @pluteojs/database, but we reference it here)
	DATABASE_URL: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;
