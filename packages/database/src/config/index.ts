import dotenv from "dotenv";

import {databaseEnvSchema} from "@/config/envSchema";
import {serverModes} from "@/constants/databaseConstants";
import {createPostgresConnectionUrl, resolveEnvFilePath} from "@/util/configUtil";

/**
 * Database configuration module.
 *
 * Loads environment variables from the appropriate .env file based on NODE_ENV,
 * validates them using Zod schema, and exports a structured configuration object.
 */

// Default to development.local if NODE_ENV is not set
process.env.NODE_ENV = process.env.NODE_ENV || serverModes.DEVELOPMENT_LOCAL;

// Determine which env file to load based on environment
const primaryEnvPath = resolveEnvFilePath();

// Attempt to load the primary env file
const loadResult = dotenv.config({path: primaryEnvPath});

// If primary env file not found, try fallback locations
// This is useful when running from the package directory or in different contexts
if (loadResult.error) {
	dotenv.config({path: ".env"});
	dotenv.config({path: ".env.local"});
	dotenv.config({path: "../../apps/express-api-server/.env.development.local"});
	dotenv.config({path: "../../apps/express-api-server/.env.development"});
}

// Validate and parse environment variables
const validatedEnv = databaseEnvSchema.parse(process.env);

// Build connection URL from individual params if DATABASE_URL not provided
let connectionUrl = validatedEnv.DATABASE_URL;

if (
	!connectionUrl &&
	validatedEnv.DATABASE_HOST &&
	validatedEnv.DATABASE_PORT &&
	validatedEnv.DATABASE_NAME &&
	validatedEnv.DATABASE_USER &&
	validatedEnv.DATABASE_USER_PASSWORD
) {
	connectionUrl = createPostgresConnectionUrl(
		validatedEnv.DATABASE_HOST,
		validatedEnv.DATABASE_PORT,
		validatedEnv.DATABASE_NAME,
		validatedEnv.DATABASE_USER,
		validatedEnv.DATABASE_USER_PASSWORD,
		validatedEnv.DB_SSL
	);
}

if (!connectionUrl) {
	throw new Error(
		"Database connection URL could not be determined. Provide DATABASE_URL or all individual connection parameters."
	);
}

/**
 * Application database configuration.
 *
 * Provides typed access to database connection settings and pool configuration.
 */
const config = {
	database: {
		url: connectionUrl,
		host: validatedEnv.DATABASE_HOST,
		port: validatedEnv.DATABASE_PORT,
		user: validatedEnv.DATABASE_USER,
		password: validatedEnv.DATABASE_USER_PASSWORD,
		name: validatedEnv.DATABASE_NAME,
		ssl: validatedEnv.DB_SSL,
		pool: {
			min: validatedEnv.DB_POOL_MIN,
			max: validatedEnv.DB_POOL_MAX,
			idleTimeout: validatedEnv.DB_POOL_IDLE_TIMEOUT,
		},
	},

	environment: validatedEnv.NODE_ENV,
};

export default config;
