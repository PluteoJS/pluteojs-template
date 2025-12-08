/**
 * Runtime environment modes for the application.
 * Used to determine configuration loading and behavior.
 */
export enum serverModes {
	DEVELOPMENT_LOCAL = "development.local",
	DEVELOPMENT = "development",
	TEST = "test",
	STAGING = "staging",
	PRODUCTION = "production",
}

/**
 * PostgreSQL SSL connection modes.
 * @see https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-SSLMODE-STATEMENTS
 */
export enum databaseSslModes {
	DISABLE = "disable",
	REQUIRE = "require",
	VERIFY_CA = "verify-ca",
	VERIFY_FULL = "verify-full",
}
