import express from "express";
import type {ErrorRequestHandler, RequestHandler} from "express";
import helmet from "helmet";
import cors from "cors";
import {isCelebrateError} from "celebrate";

import config from "@config";
import apiRoutes from "@api/index";

import serviceUtil from "@util/serviceUtil";
import securityUtil from "@util/securityUtil";

import {httpStatusCodes} from "@customTypes/networkTypes";
import {
	ValidationErrorsType,
	iValidationErrorDetails,
} from "@customTypes/commonServiceTypes";

import {genericServiceErrors} from "@constants/errors/genericServiceErrors";

import Joi from "joi";
import PackageJSON from "../../package.json";

/**
 * Adds a unique request id to each request.
 * @param req
 * @param res
 * @param next
 */
const addRequestId: RequestHandler = (req, res, next) => {
	req.uniqueRequestId = securityUtil.generateUUID();

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
	const {uniqueRequestId} = req;

	const result = serviceUtil.buildResult(
		false,
		httpStatusCodes.CLIENT_ERROR_NOT_FOUND,
		uniqueRequestId,
		genericServiceErrors.errors.ResourceNotFound
	);

	const {httpStatusCode} = result;

	return res.status(httpStatusCode).json(result);
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
const celebrateValidationErrorHandler: ErrorRequestHandler = (
	err,
	req,
	res,
	next
) => {
	if (!isCelebrateError(err)) {
		return next(err);
	}

	const validationErrors: ValidationErrorsType = Array.from(
		err.details.entries()
	).reduce(
		(errors: Record<string, iValidationErrorDetails>, [segment, joiError]) => {
			return {
				...errors,
				[segment]: {
					source: segment,
					keys: joiError.details.map((detail: Joi.ValidationErrorItem) => {
						return detail.path[0];
					}),
					message: joiError.message,
				},
			};
		},
		{}
	);

	const {uniqueRequestId} = req;

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

	return res
		.status(httpStatusCodes.CLIENT_ERROR_BAD_REQUEST)
		.json(result)
		.end();
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
		const {uniqueRequestId} = req;

		const result = serviceUtil.buildResult(
			false,
			httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED,
			uniqueRequestId,
			genericServiceErrors.auth.NoAuthorizationToken
		);

		const {httpStatusCode} = result;

		return res.status(httpStatusCode).json(result).end();
	}

	return next(err);
};

/**
 * Handles all other generic error.
 *
 * @param err
 * @param req
 * @param res
 */
const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	const {uniqueRequestId} = req;

	const result = serviceUtil.buildResult(
		false,
		httpStatusCodes.SERVER_ERROR_INTERNAL_SERVER_ERROR,
		uniqueRequestId,
		genericServiceErrors.errors.SomethingWentWrong
	);

	const {httpStatusCode} = result;

	return res.status(httpStatusCode).json(result).end();
};

/**
 * Handles "/" endpoint.
 *
 * @param req
 * @param res
 */
const rootRequestHandler: RequestHandler = (req, res) => {
	const {uniqueRequestId} = req;

	const data = {
		name: PackageJSON.name,
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

	return res.status(httpStatusCode).json(result).end();
};

/**
 * Handles "/status" health check endpoint.
 *
 * @param req
 * @param res
 */
const statusRequestHandler: RequestHandler = (req, res) => {
	const {uniqueRequestId} = req;

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

	return res.status(httpStatusCode).json(result).end();
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

	// celebrate error handler.
	app.use(celebrateValidationErrorHandler);

	// error handlers:
	// catches 404 and forward to error handler
	app.use(resourceNotFoundHandler);

	// Handle 401 thrown by express-jwt library
	app.use(unAuthorizedErrorHandler);

	// Handles all other generic error
	app.use(genericErrorHandler);
};

export default loadExpress;
