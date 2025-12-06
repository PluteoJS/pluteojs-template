import type {Request, Response, NextFunction, RequestHandler} from "express";
import type {ZodSchema, ZodError} from "zod";

import {httpStatusCodes} from "@customTypes/networkTypes";
import type {ValidationErrorsType} from "@customTypes/serviceTypes";
import serviceUtil from "@util/serviceUtil";
import {genericServiceErrors} from "@constants/errors/genericServiceErrors";

/**
 * Formats Zod validation errors into the expected ValidationErrorsType format.
 *
 * @param error - The Zod error object
 * @param segment - The request segment (body, query, params)
 * @returns Formatted validation errors
 */
function formatZodErrors(error: ZodError, segment: string): ValidationErrorsType {
	const keys = error.errors.map((err) => {
		return err.path[0] || "unknown";
	});
	const messages = error.errors.map((err) => {
		return err.message;
	});

	return {
		[segment]: {
			source: segment,
			keys,
			message: messages.join(", "),
		},
	};
}

/**
 * Creates a validation middleware for request body using Zod schemas.
 *
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const validationErrors = formatZodErrors(result.error, "body");
			const uniqueRequestId = (req as Request & {uniqueRequestId?: string}).uniqueRequestId || null;

			const response = serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				{
					...genericServiceErrors.errors.ValidationError,
					validationErrors,
				},
				null
			);

			res.status(httpStatusCodes.CLIENT_ERROR_BAD_REQUEST).json(response).end();
			return;
		}

		// eslint-disable-next-line no-param-reassign
		req.body = result.data;
		next();
	};
}

/**
 * Creates a validation middleware for query parameters using Zod schemas.
 *
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export function validateQuery<T>(schema: ZodSchema<T>): RequestHandler {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.query);

		if (!result.success) {
			const validationErrors = formatZodErrors(result.error, "query");
			const uniqueRequestId = (req as Request & {uniqueRequestId?: string}).uniqueRequestId || null;

			const response = serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				{
					...genericServiceErrors.errors.ValidationError,
					validationErrors,
				},
				null
			);

			res.status(httpStatusCodes.CLIENT_ERROR_BAD_REQUEST).json(response).end();
			return;
		}

		next();
	};
}

/**
 * Creates a validation middleware for URL parameters using Zod schemas.
 *
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export function validateParams<T>(schema: ZodSchema<T>): RequestHandler {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.params);

		if (!result.success) {
			const validationErrors = formatZodErrors(result.error, "params");
			const uniqueRequestId = (req as Request & {uniqueRequestId?: string}).uniqueRequestId || null;

			const response = serviceUtil.buildResult(
				false,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
				uniqueRequestId,
				{
					...genericServiceErrors.errors.ValidationError,
					validationErrors,
				},
				null
			);

			res.status(httpStatusCodes.CLIENT_ERROR_BAD_REQUEST).json(response).end();
			return;
		}

		next();
	};
}
