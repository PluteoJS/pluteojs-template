import type {RequestHandler, Response} from "express";

import type {iResponseError, iGenericAPIResponse} from "@customTypes/responseTypes";
import {httpStatusCodes} from "@customTypes/networkTypes";

// Import expressTypes to ensure the global augmentation is applied
import "@customTypes/expressTypes";

/**
 * Response envelope middleware.
 *
 * Attaches helper methods to the Express Response object:
 * - res.ok(data, statusCode?) - Send a success response
 * - res.fail(error, statusCode?, details?) - Send an error response
 * - res.setResponseMeta(meta) - Add metadata to the response (pagination, etc.)
 */
export const responseEnvelope: RequestHandler = (req, res, next) => {
	// Initialize response meta with null pagination
	res.locals.responseMeta = {pagination: null};

	/**
	 * Merge additional metadata into the response meta.
	 */
	res.setResponseMeta = (meta: Record<string, unknown>): void => {
		res.locals.responseMeta = {...res.locals.responseMeta, ...meta};
	};

	/**
	 * Build the envelope body.
	 */
	const buildBody = <T>(
		isSuccess: boolean,
		status: number,
		data: T,
		error: iResponseError | null
	): iGenericAPIResponse<T> => {
		const typedReq = req as Express.Request & {uniqueRequestId?: string};

		return {
			isSuccess,
			httpStatusCode: status as httpStatusCodes,
			meta: {
				URID: typedReq.uniqueRequestId ?? "",
				pagination: null,
				...res.locals.responseMeta,
			},
			error,
			data,
		};
	};

	/**
	 * Send a success response wrapped in the standard envelope.
	 */
	res.ok = <T>(data: T, statusCode = httpStatusCodes.SUCCESS_OK): Response => {
		const body = buildBody(true, statusCode, data, null);
		return res.status(statusCode).json(body);
	};

	/**
	 * Send an error response wrapped in the standard envelope.
	 */
	res.fail = (
		errorLike: iResponseError | string,
		statusCode = httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
		details: Record<string, unknown> | null = null
	): Response => {
		const error: iResponseError =
			typeof errorLike === "string"
				? {error: "ERROR", message: errorLike, details}
				: errorLike;

		const body = buildBody(false, statusCode, null, error);
		return res.status(statusCode).json(body);
	};

	next();
};
