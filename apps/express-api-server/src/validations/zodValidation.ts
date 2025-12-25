import type {Request, Response, NextFunction, RequestHandler} from "express";
import type {ZodSchema, ZodError} from "zod";

import {httpStatusCodes} from "@customTypes/networkTypes";
import type {iResponseError} from "@customTypes/responseTypes";
import {genericServiceErrors} from "@constants/errors/genericServiceErrors";

// Import expressTypes to ensure the global augmentation is applied
import "@customTypes/expressTypes";

/**
 * Validation error details structure.
 */
interface iValidationErrorDetails {
	source: string;
	keys: (string | number)[];
	message: string;
}

/**
 * Formats Zod validation errors into the expected format.
 *
 * @param error - The Zod error object
 * @param segment - The request segment (body, query, params)
 * @returns Formatted validation errors
 */
function formatZodErrors(
	error: ZodError,
	segment: string
): Record<string, iValidationErrorDetails> {
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

			const errorResponse: iResponseError = {
				...genericServiceErrors.errors.ValidationError,
				details: {validationErrors},
			};

			res.fail(errorResponse, httpStatusCodes.CLIENT_ERROR_BAD_REQUEST);
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

			const errorResponse: iResponseError = {
				...genericServiceErrors.errors.ValidationError,
				details: {validationErrors},
			};

			res.fail(errorResponse, httpStatusCodes.CLIENT_ERROR_BAD_REQUEST);
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

			const errorResponse: iResponseError = {
				...genericServiceErrors.errors.ValidationError,
				details: {validationErrors},
			};

			res.fail(errorResponse, httpStatusCodes.CLIENT_ERROR_BAD_REQUEST);
			return;
		}

		next();
	};
}
