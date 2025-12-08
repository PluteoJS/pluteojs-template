import {serverModes} from "@/constants/databaseConstants";

/**
 * NOTE: Avoid importing from "@/config" here to prevent circular dependencies.
 */

/**
 * Determines the appropriate .env file path based on the current NODE_ENV.
 *
 * Mapping:
 * - production       -> .env.production
 * - staging          -> .env.staging
 * - test             -> .env.test
 * - development      -> .env.development
 * - development.local (default) -> .env.development.local
 */
export const resolveEnvFilePath = (): string => {
	const environment = process.env.NODE_ENV;

	switch (environment) {
		case serverModes.PRODUCTION:
			return "./.env.production";

		case serverModes.STAGING:
			return "./.env.staging";

		case serverModes.TEST:
			return "./.env.test";

		case serverModes.DEVELOPMENT:
			return "./.env.development";

		default:
			return "./.env.development.local";
	}
};

/**
 * Constructs a PostgreSQL connection URL from individual connection parameters.
 *
 * @param host - Database server hostname or IP address
 * @param port - Database server port number
 * @param dbName - Name of the database to connect to
 * @param user - Database username for authentication
 * @param password - Database password for authentication
 * @param useSsl - Whether to require SSL connection (appends ?sslmode=require)
 * @returns Formatted PostgreSQL connection URL
 */
export const createPostgresConnectionUrl = (
	host: string,
	port: number,
	dbName: string,
	user: string,
	password: string,
	useSsl: boolean = false
): string => {
	const sslQueryParam = useSsl ? "?sslmode=require" : "";
	return `postgresql://${user}:${password}@${host}:${port}/${dbName}${sslQueryParam}`;
};
