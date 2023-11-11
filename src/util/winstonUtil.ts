import winston, {Logger} from "winston";
import WinstonSlackHook from "winston-slack-webhook-transport";

import Config from "@config";
import {loggingLevels} from "@constants/serverConstants";
import {NullableString} from "customTypes/commonTypes";

/**
 * Returns the path to the log file for the specified logging level.
 * @param loggingLevel - The logging level to get the log file path for.
 * @returns - The path to the log file for the specified logging level.
 */
function getLogFilePath(loggingLevel: loggingLevels): string {
	const filePath = Config.logging.transports.file.paths[loggingLevel];

	return filePath;
}

/**
 * Creates a console transport for the logger instance.
 * @returns - The console transport for the logger instance.
 */
function createConsoleTransport(
	loggingLevel: loggingLevels = loggingLevels.SILLY
): winston.transports.ConsoleTransportInstance {
	const consoleTransport = new winston.transports.Console({
		level: loggingLevel,
		format: winston.format.combine(
			winston.format.cli(),
			winston.format.splat()
		),
	});

	return consoleTransport;
}

/**
 * Creates a slack transport for the logger instance.
 * @param loggingLevel - The logging level to get the slack transport for.
 * @returns - The slack transport for the logger instance.
 */
function createSlackTransport(
	loggingLevel: loggingLevels = loggingLevels.ERROR
): WinstonSlackHook {
	const slackTransport = new WinstonSlackHook({
		level: loggingLevel,
		webhookUrl: Config.logging.transports.slack.webhookUrl,
		format: winston.format.combine(
			winston.format.timestamp({
				format: "YYYY-MM-DD HH:mm:ss:zzz",
			}),
			winston.format.errors({stack: true}),
			winston.format.splat(),
			winston.format.json()
		),
	});

	return slackTransport;
}

/**
 * Creates a file transport for the logger instance.
 * @param loggingLevel - The logging level to get the file transport for.
 * @returns - The file transport for the logger instance.
 */
function createFileTransport(
	loggingLevel: loggingLevels = loggingLevels.ERROR
): winston.transports.FileTransportInstance {
	const fileName = getLogFilePath(loggingLevel);

	const fileTransport = new winston.transports.File({
		level: loggingLevel,
		filename: fileName,
		format: winston.format.combine(
			winston.format.timestamp({
				format: "YYYY-MM-DD HH:mm:ss:zzz",
			}),
			winston.format.errors({stack: true}),
			winston.format.splat(),
			winston.format.json()
		),
	});

	return fileTransport;
}

/**
 * Creates and returns a function that can be used to log error level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log error level logs.
 */
function createErrorLogger(loggerInstance: Logger) {
	return function logError(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.error({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log warning level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log warnings level logs.
 */
function createWarningLogger(loggerInstance: Logger) {
	return function logWarning(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.warn({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log help level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log help level logs.
 */
function createHelpLogger(loggerInstance: Logger) {
	return function logHelp(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.help({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log data level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log data level related logs.
 */
function createDataLogger(loggerInstance: Logger) {
	return function logData(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.data({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log info level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log info level logs.
 */
function createInfoLogger(loggerInstance: Logger) {
	return function logInfo(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.info({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log debug level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log debug level logs.
 */
function createDebugLogger(loggerInstance: Logger) {
	return function logDebug(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.debug({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log prompt level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log prompt level logs.
 */
function createPromptLogger(loggerInstance: Logger) {
	return function logPrompt(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.prompt({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log verbose level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log verbose level logs.
 */
function createVerboseLogger(loggerInstance: Logger) {
	return function logVerbose(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.verbose({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log input level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log input level logs.
 */
function createInputLogger(loggerInstance: Logger) {
	return function logInput(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.input({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
			extras: extras || null,
		});
	};
}

/**
 * Creates and returns a function that can be used to log http level logs.
 * @param loggerInstance - Winston logger instance to use.
 * @returns - Function that can be used to log http level logs.
 */
function createHttpLogger(loggerInstance: Logger) {
	return function logHttp(
		uniqueRequestId?: NullableString,
		message?: NullableString,
		error?: unknown,
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
		extras?: any
	): Logger {
		return loggerInstance.http({
			uniqueRequestId: uniqueRequestId || null,
			message: message || null,
			error: error || null,
		});
	};
}

export {
	createConsoleTransport,
	createSlackTransport,
	createFileTransport,
	createErrorLogger,
	createWarningLogger,
	createHelpLogger,
	createDataLogger,
	createInfoLogger,
	createDebugLogger,
	createPromptLogger,
	createVerboseLogger,
	createInputLogger,
	createHttpLogger,
};
