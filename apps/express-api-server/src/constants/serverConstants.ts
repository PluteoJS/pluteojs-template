export enum serverModes {
	DEVELOPMENT_LOCAL = "development.local",
	DEVELOPMENT = "development",
	STAGING = "staging",
	PRODUCTION = "production",
}

/**
 * Enum for logging levels.
 * {error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6}
 */
export enum loggingLevels {
	ERROR = "error",
	WARN = "warn",
	INFO = "info",
	HTTP = "http",
	VERBOSE = "verbose",
	DEBUG = "debug",
	SILLY = "silly",
}

export enum RequestHeaders {
	CONTENT_TYPE = "Content-Type",
	REQUEST_ID = "X-Request-Id",
	AUTHORIZATION = "Authorization",
}
