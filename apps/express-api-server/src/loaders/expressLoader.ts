import express from "express";
import type {ErrorRequestHandler, RequestHandler} from "express";
import helmet from "helmet";
import cors from "cors";
import type {ZodError} from "zod";

import config from "@config";
import apiRoutes from "@api/index";
import logger from "@loaders/logger";

import serviceUtil from "@util/serviceUtil";
import securityUtil from "@util/securityUtil";

import {httpStatusCodes} from "@customTypes/networkTypes";
import type {ValidationErrorsType, iValidationErrorDetails} from "@customTypes/serviceTypes";

import {genericServiceErrors} from "@constants/errors/genericServiceErrors";

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
	const uniqueRequestId = (req as express.Request & {uniqueRequestId: string}).uniqueRequestId;

	const result = serviceUtil.buildResult(
		false,
		httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
		uniqueRequestId,
		genericServiceErrors.errors.ResourceNotFound
	);

	const {httpStatusCode} = result;

	res.status(httpStatusCode).json(result);

	return;
};

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
		const validationErrors: ValidationErrorsType = {};

		zodError.errors.forEach((error) => {
			const segment = "body";
			if (!validationErrors[segment]) {
				validationErrors[segment] = {
					source: segment,
					keys: [],
					message: "",
				} as iValidationErrorDetails;
			}
			validationErrors[segment].keys.push(error.path[0] || "unknown");
			validationErrors[segment].message = zodError.errors
				.map((e) => {
					return e.message;
				})
				.join(", ");
		});

		const uniqueRequestId = (req as express.Request & {uniqueRequestId: string}).uniqueRequestId;

		const result = serviceUtil.buildResult(
			false,
			httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
			uniqueRequestId,
			{
				...genericServiceErrors.errors.ValidationError,
				validationErrors,
			},
			null
		);

		res.status(httpStatusCodes.CLIENT_ERROR_BAD_REQUEST).json(result).end();

		return;
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
		const uniqueRequestId = (req as express.Request & {uniqueRequestId: string}).uniqueRequestId;

		const result = serviceUtil.buildResult(
			false,
			httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED,
			uniqueRequestId,
			genericServiceErrors.auth.NoAuthorizationToken
		);

		const {httpStatusCode} = result;

		res.status(httpStatusCode).json(result).end();

		return;
	}

	next(err);

	return;
};

/**
 * Handles all other generic error.
 *
 * @param err
 * @param req
 * @param res
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const genericErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
	const uniqueRequestId = (req as express.Request & {uniqueRequestId: string}).uniqueRequestId;

	// Log the actual error for debugging
	logger.error(uniqueRequestId, "Unhandled error in request", err, {
		path: req.path,
		method: req.method,
		errorMessage: err?.message,
		errorStack: err?.stack,
	});

	const result = serviceUtil.buildResult(
		false,
		httpStatusCodes.SERVER_ERROR_INTERNAL_SERVER_ERROR,
		uniqueRequestId,
		genericServiceErrors.errors.SomethingWentWrong
	);

	const {httpStatusCode} = result;

	res.status(httpStatusCode).json(result).end();

	return;
};

/**
 * Handles "/" endpoint.
 *
 * @param req
 * @param res
 */
const rootRequestHandler: RequestHandler = (req, res) => {
	const uniqueRequestId = (req as express.Request & {uniqueRequestId: string}).uniqueRequestId;

	const data = {
		name: config.serviceInfo.name,
		version: PackageJSON.version,
	};

	const result = serviceUtil.buildResult(
		true,
		httpStatusCodes.SUCCESS_OK,
		uniqueRequestId,
		null,
		data
	);

	const {httpStatusCode} = result;

	res.status(httpStatusCode).json(result).end();

	return;
};

/**
 * Handles "/status" health check endpoint.
 *
 * @param req
 * @param res
 */
const statusRequestHandler: RequestHandler = (req, res) => {
	const uniqueRequestId = (req as express.Request & {uniqueRequestId: string}).uniqueRequestId;

	const data = {
		name: PackageJSON.name,
		version: PackageJSON.version,
		status: "OK",
	};

	const result = serviceUtil.buildResult(
		true,
		httpStatusCodes.SUCCESS_OK,
		uniqueRequestId,
		null,
		data
	);

	const {httpStatusCode} = result;

	res.status(httpStatusCode).json(result).end();

	return;
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
