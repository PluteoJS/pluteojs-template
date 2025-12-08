/**
 * Database-related constants.
 */
export const databaseConstants = {
	/** Default connection pool size */
	DEFAULT_POOL_SIZE: 10,

	/** Table names for reference */
	tables: {
		USERS: "users",
		EMAIL_LOGS: "email_logs",
		EMAIL_VERIFICATION_REQUEST_LOGS: "email_verification_request_logs",
		RESET_PASSWORD_LOGS: "reset_password_logs",
	},
} as const;
