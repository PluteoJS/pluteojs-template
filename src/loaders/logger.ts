import winston from "winston";

import Config from "@config";
import {
	createConsoleTransport,
	createFileTransport,
	createSlackTransport,
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
} from "@util/winstonUtil";
import {loggingLevels, serverModes} from "@constants/serverConstants";

/**
 * Creating an array of transports to be used by the logger instance.
 * @type {Array}
 **/
const transports = [];

/**
 * If the server is in development mode, we want to log everything to the console
 * and to a file. If the server is in production mode, we want to log only errors,
 * warnings, and info to the file and slack. We won't log anything to the console
 * in production mode.
 */
console.log(
	"🚀 ~ file: logger.ts:24 ~ process.env.NODE_ENV:",
	process.env.NODE_ENV
);
if (process.env.NODE_ENV === serverModes.DEVELOPMENT) {
	// registering the console transport
	transports.push(createConsoleTransport());

	// registering the file transport
	transports.push(createFileTransport(loggingLevels.ERROR));
	transports.push(createFileTransport(loggingLevels.WARN));
	transports.push(createFileTransport(loggingLevels.INFO));
	transports.push(createFileTransport(loggingLevels.VERBOSE));
	transports.push(createFileTransport(loggingLevels.DEBUG));
	transports.push(createFileTransport(loggingLevels.SILLY));
} else if (process.env.NODE_ENV === serverModes.STAGING) {
	// registering the console transport
	transports.push(createConsoleTransport());

	// registering the file transport
	transports.push(createFileTransport(loggingLevels.ERROR));
	transports.push(createFileTransport(loggingLevels.WARN));
	transports.push(createFileTransport(loggingLevels.INFO));
	transports.push(createFileTransport(loggingLevels.VERBOSE));
	transports.push(createFileTransport(loggingLevels.DEBUG));
	transports.push(createFileTransport(loggingLevels.SILLY));
} else {
	// process.env.NODE_ENV === serverModes.STAGING

	// registering the slack transport
	transports.push(createSlackTransport(loggingLevels.ERROR));
	// registering the file transports
	transports.push(createFileTransport(loggingLevels.ERROR));
	transports.push(createFileTransport(loggingLevels.WARN));
	transports.push(createFileTransport(loggingLevels.INFO));
}

const customFormat = winston.format.printf(
	({level, message, timestamp, uniqueRequestId}) => {
		return `${timestamp} [${uniqueRequestId}] ${level}: ${message}`;
	}
);

/**
 * Creating the logger instance with the specified transports and logging level.
 */
const loggerInstance = winston.createLogger({
	level: Config.logging.level,
	levels: winston.config.npm.levels,
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.errors({stack: true}),
		winston.format.splat(),
		customFormat,
		winston.format.json()
	),
	transports,
});

export default {
	loggerInstance,

	error: createErrorLogger(loggerInstance),
	warning: createWarningLogger(loggerInstance),
	help: createHelpLogger(loggerInstance),
	data: createDataLogger(loggerInstance),
	info: createInfoLogger(loggerInstance),
	debug: createDebugLogger(loggerInstance),
	prompt: createPromptLogger(loggerInstance),
	verbose: createVerboseLogger(loggerInstance),
	input: createInputLogger(loggerInstance),
	http: createHttpLogger(loggerInstance),

	// Using the direct silly method from the winston logger instance
	silly: loggerInstance.silly.bind(loggerInstance),
};
