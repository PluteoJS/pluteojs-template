import express from "express";
import type {ErrorRequestHandler, RequestHandler} from "express";
import helmet from "helmet";
import cors from "cors";
import type {ZodError} from "zod";

import config from "@config";
import apiRoutes from "@api/index";
import {responseEnvelope} from "@api/middlewares";
import logger from "@loaders/logger";

import securityUtil from "@util/securityUtil";

import {httpStatusCodes} from "@customTypes/networkTypes";
import type {iResponseError} from "@customTypes/responseTypes";

import {genericServiceErrors} from "@constants/errors/genericServiceErrors";
import {ServiceError} from "@errors/ServiceError";

import PackageJSON from "../../package.json";

/**
 * Adds a unique request id to each request.
 *
 * This is useful for tracking requests in logs and debugging.
 *
 * @param req
 * @param res
 * @param next
 */
const addRequestId: RequestHandler = (req, res, next) => {
	/**
	 * We are using a custom middleware to add a unique request id to each
	 * request. This is useful for tracking requests in logs and debugging.
	 */
	// eslint-disable-next-line no-param-reassign
	(req as express.Request & {uniqueRequestId: string}).uniqueRequestId =
		securityUtil.generateUUID();

	next();
};

/**
 * Handles all the 404 errors.
 *
 * @param req
 * @param res
 * @param next
 */
const resourceNotFoundHandler: RequestHandler = (req, res) => {
	return res.fail(
		genericServiceErrors.errors.ResourceNotFound,
		httpStatusCodes.CLIENT_ERROR_NOT_FOUND
	);
};

/**
 * Validation error details structure for the response.
 */
interface iValidationErrorDetails {
	source: string;
	keys: (string | number | symbol)[];
	message: string;
}

/**
 * Handle Zod validation errors.
 *
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
const zodValidationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	// Check if it's a Zod error
	if (err && err.name === "ZodError") {
		const zodError = err as ZodError;
		const validationErrors: Record<string, iValidationErrorDetails> = {};

		zodError.issues.forEach((issue) => {
			const segment = "body";
			if (!validationErrors[segment]) {
				validationErrors[segment] = {
					source: segment,
					keys: [],
					message: "",
				};
			}
			validationErrors[segment].keys.push(issue.path[0] || "unknown");
			validationErrors[segment].message = zodError.issues
				.map((iss) => {
					return iss.message;
				})
				.join(", ");
		});

		const errorResponse: iResponseError = {
			...genericServiceErrors.errors.ValidationError,
			details: {validationErrors},
		};

		return res.fail(errorResponse, httpStatusCodes.CLIENT_ERROR_BAD_REQUEST);
	}

	next(err);

	return;
};

/**
 * Handle 401 thrown by express-jwt library
 *
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
const unAuthorizedErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	/**
	 * Handle 401 thrown by express-jwt library
	 */
	if (err.name === "UnauthorizedError") {
		return res.fail(
			genericServiceErrors.auth.NoAuthorizationToken,
			httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED
		);
	}

	next(err);

	return;
};

/**
 * Handles all other generic errors including ServiceError.
 *
 * @param err
 * @param req
 * @param res
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const genericErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
	const uniqueRequestId = (req as express.Request & {uniqueRequestId: string}).uniqueRequestId;

	// Handle ServiceError thrown by service layer
	if (err instanceof ServiceError) {
		return res.fail(err.serviceError, err.httpStatusCode);
	}

	// Log the actual error for debugging
	logger.error(uniqueRequestId, "Unhandled error in request", err, {
		path: req.path,
		method: req.method,
		errorMessage: err?.message,
		errorStack: err?.stack,
	});

	return res.fail(
		genericServiceErrors.errors.SomethingWentWrong,
		httpStatusCodes.SERVER_ERROR_INTERNAL_SERVER_ERROR
	);
};

/**
 * Handles "/" endpoint.
 *
 * @param req
 * @param res
 */
const rootRequestHandler: RequestHandler = (req, res) => {
	const data = {
		name: config.serviceInfo.name,
		version: PackageJSON.version,
	};

	return res.ok(data);
};

/**
 * Handles "/status" health check endpoint.
 *
 * @param req
 * @param res
 */
const statusRequestHandler: RequestHandler = (req, res) => {
	const data = {
		name: PackageJSON.name,
		version: PackageJSON.version,
		status: "OK",
	};

	return res.ok(data);
};

/**
 * Takes care of all the initial express-js setup and configuration.
 *
 * @param {app: express.Application}
 * @returns void
 */
const loadExpress = ({app}: {app: express.Application}): void => {
	// Useful when behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// It shows the real origin IP in the heroku or Cloudwatch logs
	app.enable("trust proxy");

	// Use helmet
	app.use(helmet());

	// Enable Cross Origin Resource Sharing to all origins by default
	app.use(cors());

	// adds a unique id to each request
	app.use(addRequestId);

	// Response envelope middleware - adds res.ok() and res.fail() helpers
	app.use(responseEnvelope);

	// Transforms the raw string of req.body into json
	app.use(express.json());

	/**
	 * Root request endpoint
	 */
	app.get("/", rootRequestHandler);

	/**
	 * Health Check endpoints
	 */
	app.get("/status", statusRequestHandler);

	// Loads API routes
	app.use(config.api.prefix, apiRoutes());

	// Zod validation error handler
	app.use(zodValidationErrorHandler);

	// error handlers:
	// catches 404 and forward to error handler
	app.use(resourceNotFoundHandler);

	// Handle 401 thrown by express-jwt library
	app.use(unAuthorizedErrorHandler);

	// Handles all other generic error
	app.use(genericErrorHandler);
};

export default loadExpress;
