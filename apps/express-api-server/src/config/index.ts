import dotenv from "dotenv";

import {loggingLevels, serverModes} from "@constants/serverConstants";

import configUtil from "@util/configUtil";
import typeUtil from "@util/typeUtil";

// set the default NODE_ENV to "development"
process.env.NODE_ENV = process.env.NODE_ENV || serverModes.DEVELOPMENT_LOCAL;

// setting the env_file path
const envFilePath = configUtil.getEnvFilePath();

// loading .env file
const envFile = dotenv.config({
	path: envFilePath,
});

if (envFile.error) {
	throw new Error("Couldn't find .env file");
}

// Print the current server environment mode
console.log(`\nServer is running in "${process.env.NODE_ENV}" mode.`);

// Print env configuration loading status to console
console.log(`Environment variables loaded from "${envFilePath}" file.\n`);

export default {
	// Example of a custom template specific env variable
	custom: {
		templateSpecificEnvVar: process.env.CUSTOM_TEMPLATE_SPECIFIC_ENV_VAR,
	},

	// Service info
	serviceInfo: {
		name: process.env.SERVICE_NAME,
	},

	// server port
	port: parseInt(process.env.PORT || "3020", 10),

	// clustering
	clusterOptions: {
		hasClusteringEnabled: typeUtil.parseBooleanFromString(
			process.env.HAS_CLUSTERING_ENABLED
		),
	},

	// winston logger configurations
	logging: {
		level: process.env.LOG_LEVEL || loggingLevels.SILLY,
		transports: {
			slack: {
				webhookUrl: process.env.LOGGING_TRANSPORT_SLACK_WEBHOOK_URL || "",
			},
			file: {
				paths: {
					error: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_ERROR_LOG_FILE_NAME}`,
					warn: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_WARN_LOG_FILE_NAME}`,
					info: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_INFO_LOG_FILE_NAME}`,
					http: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_HTTP_LOG_FILE_NAME}`,
					verbose: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_VERBOSE_LOG_FILE_NAME}`,
					debug: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_DEBUG_LOG_FILE_NAME}`,
					silly: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_SILLY_LOG_FILE_NAME}`,
					combined: `${process.env.LOGGING_TRANSPORT_FILE_LOGS_DIRECTORY}/${process.env.LOGGING_TRANSPORT_FILE_COMBINED_LOG_FILE_NAME}`,
				},
			},
		},
	},

	// api config
	api: {
		prefix: "/api",
		versions: {
			current: "v1",
			supported: ["v1"],
			deprecated: [] as string[],
			defaultVersion: "v1",
		},
	},

	// database config
	database: {
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_USER_PASSWORD,
		dbName: process.env.DATABASE_NAME,

		pgPromiseOptions: {},
	},

	emailService: {
		mailgun: {
			domain: process.env.EMAIL_SERVICE_MAILGUN_DOMAIN,
			username: process.env.EMAIL_SERVICE_MAILGUN_USERNAME,
			sendingAPIKey: process.env.EMAIL_SERVICE_MAILGUN_SENDING_API_KEY,
			privateAPIKey: process.env.EMAIL_SERVICE_MAILGUN_PRIVATE_API_KEY,
			senderId: process.env.EMAIL_SERVICE_MAILGUN_SENDER_ID
				? `${process.env.EMAIL_SERVICE_MAILGUN_SENDER_ID}@${process.env.EMAIL_SERVICE_MAILGUN_DOMAIN}`
				: "",
		},

		transactionalEmail: {
			smtpHost: process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_HOST,
			smtpPort: Number(process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_PORT),
			smtpSecure: Boolean(process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_SECURE),
			smtpUsername: process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_USERNAME,
			smtpFromAddress:
				process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_FROM_ADDRESS || "",
			smtpPassword: process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_PASSWORD,
		},

		marketingEmail: {
			smtpHost: process.env.EMAIL_SERVICE_MARKETING_SMTP_HOST,
			smtpPort: Number(process.env.EMAIL_SERVICE_MARKETING_SMTP_PORT),
			smtpSecure: Boolean(process.env.EMAIL_SERVICE_MARKETING_SMTP_SECURE),
			smtpUsername: process.env.EMAIL_SERVICE_MARKETING_SMTP_USERNAME,
			smtpFromAddress: process.env.EMAIL_SERVICE_MARKETING_SMTP_FROM_ADDRESS,
			smtpPassword: process.env.EMAIL_SERVICE_MARKETING_SMTP_PASSWORD,
		},
	},

	verificationConfig: {
		emailVerificationOtpCustomAlphabet:
			process.env.EMAIL_VERIFICATION_OTP_CUSTOM_ALPHABET || "0123456789",
		emailVerificationOtpLength: Number(
			process.env.EMAIL_VERIFICATION_OTP_LENGTH || "6"
		),
		emailVerificationOtpValidity: Number(
			process.env.EMAIL_VERIFICATION_OTP_VALIDITY_IN_MINUTES || "15"
		),
		emailVerificationRetryIntervalInMinutes: Number(
			process.env.EMAIL_VERIFICATION_RETRY_INTERVAL_IN_MINUTES || "5"
		),
	},

	// Better Auth configuration
	betterAuth: {
		enableResponseEnvelope:
			process.env.BETTER_AUTH_ENABLE_RESPONSE_ENVELOPE !== "false",
		// Allowed endpoints can be customized via environment or left as default
		allowedEndpoints: {} as Record<string, string[]>, // Empty = use defaults from @pluteojs/better-auth
	},
};
