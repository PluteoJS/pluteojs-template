import fs from "fs";

import dotenv from "dotenv";
import {Algorithm} from "jsonwebtoken";

import {loggingLevels, serverModes} from "@constants/serverConstants";

import configUtil from "@util/configUtil";

// set the default NODE_ENV to "development"
process.env.NODE_ENV = process.env.NODE_ENV || serverModes.DEVELOPMENT;

// loading .env file
const envFile = dotenv.config({
	path: configUtil.getEnvFilePath(),
});

if (envFile.error) {
	throw new Error("⚠️ Couldn't find .env file ⚠️");
}

export default {
	// server port
	port: parseInt(process.env.PORT, 10),

	// winston logger configurations
	logging: {
		level: process.env.LOG_LEVEL || loggingLevels.SILLY,
		transports: {
			slack: {
				webhookUrl: process.env.LOGGING_TRANSPORT_SLACK_WEBHOOK_URL,
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

	jwtConfig: {
		algorithm: process.env.JWT_ALGORITHM as Algorithm,
		accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
		refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
		secretKey: fs.readFileSync(process.env.JWT_SECRET_KEY_FILE_PATH),
	},

	emailService: {
		mailgun: {
			domain: process.env.EMAIL_SERVICE_MAILGUN_DOMAIN,
			username: process.env.EMAIL_SERVICE_MAILGUN_USERNAME,
			sendingAPIKey: process.env.EMAIL_SERVICE_MAILGUN_SENDING_API_KEY,
			privateAPIKey: process.env.EMAIL_SERVICE_MAILGUN_PRIVATE_API_KEY,
			senderId: `${process.env.EMAIL_SERVICE_MAILGUN_SENDER_ID}@${process.env.EMAIL_SERVICE_MAILGUN_DOMAIN}`,
		},

		transactionalEmail: {
			smtpHost: process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_HOST,
			smtpPort: Number(process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_PORT),
			smtpSecure: Boolean(process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_SECURE),
			smtpUsername: process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_USERNAME,
			smtpFromAddress:
				process.env.EMAIL_SERVICE_TRANSACTIONAL_SMTP_FROM_ADDRESS,
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

	resetPasswordConfig: {
		otpLength: Number(process.env.PASSWORD_RESET_OTP_LENGTH),
		retryIntervalInMinutes: Number(
			process.env.RESET_PASSWORD_RETRY_INTERVAL_IN_MINUTES
		),
		otpValidity: Number(process.env.RESET_PASSWORD_OTP_VALIDITY_IN_MINUTES),
	},

	verificationConfig: {
		emailVerificationOtpCustomAlphabet:
			process.env.EMAIL_VERIFICATION_OTP_CUSTOM_ALPHABET,
		emailVerificationOtpLength: Number(
			process.env.EMAIL_VERIFICATION_OTP_LENGTH
		),
		emailVerificationOtpValidity: Number(
			process.env.EMAIL_VERIFICATION_OTP_VALIDITY_IN_MINUTES
		),
		emailVerificationRetryIntervalInMinutes: Number(
			process.env.EMAIL_VERIFICATION_RETRY_INTERVAL_IN_MINUTES
		),
	},
};
