import {databaseEnvSchema, type DatabaseEnv} from "./envSchema";

/**
 * Parses and validates database environment configuration.
 */
export function parseDbConfig(): DatabaseEnv {
	const result = databaseEnvSchema.safeParse(process.env);

	if (!result.success) {
		console.error("Invalid database configuration:", result.error.format());
		throw new Error(
			"Invalid database configuration. Check environment variables."
		);
	}

	return result.data;
}

/**
 * Builds a connection string from environment variables.
 */
export function getConnectionString(config: DatabaseEnv): string {
	if (config.DATABASE_URL) {
		return config.DATABASE_URL;
	}

	return `postgresql://${config.DATABASE_USER}:${config.DATABASE_USER_PASSWORD}@${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`;
}

export {databaseEnvSchema, type DatabaseEnv} from "./envSchema";
