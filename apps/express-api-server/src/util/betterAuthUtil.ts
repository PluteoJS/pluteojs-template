import type {Response as ExpressResponse} from "express";

import {httpStatusCodes} from "@customTypes/networkTypes";
import type {iResponseError} from "@customTypes/responseTypes";

/**
 * Safely parses the JSON body from a Response object.
 *
 * This utility function attempts to parse the JSON body from a given {@link Response} object.
 * It is designed to handle cases where the response body may be null or where parsing the body
 * as JSON may throw an error (for example, if the body is not valid JSON or has already been consumed).
 *
 * - If the response body is not null, it attempts to parse and return the JSON content.
 * - If the response body is null, or if parsing fails for any reason, it returns an empty object.
 * - Any errors encountered during parsing are caught and logged to the console for debugging purposes.
 *
 * @async
 * @function safelyParseBodyFromResponse
 * @param {Response} response - The Fetch API Response object whose body should be parsed.
 * @returns {Promise<unknown>} A promise that resolves to the parsed response body as an object,
 *                             or an empty object if parsing fails or the body is null.
 *
 * @example
 * const response = await fetch('/api/some-endpoint');
 * const data = await safelyParseBodyFromResponse(response);
 * // data will be an object, or {} if the response body was empty or invalid
 */
async function safelyParseBodyFromResponse(response: Response): Promise<unknown> {
	try {
		// Only attempt to parse if the response body is not null
		if (response.body !== null) {
			const responseBody = await response.json();
			return responseBody;
		}
	} catch (error) {
		// Log parsing errors for debugging, but do not throw
		console.error("Error parsing body from response:", error);
	}
	// Return an empty object if body is null or parsing fails
	return {};
}

/**
 * Builds a standardized error response object for authentication-related errors.
 *
 * This function is used to construct an error response object that conforms to the
 * {@link iResponseError} interface. It prioritizes custom error codes and messages
 * if provided, otherwise it falls back to default error messages based on the HTTP status code.
 *
 * - If both `errorCode` and `errorMessage` are provided, these are used directly in the response.
 * - If not, the function checks the `statusCode` and returns appropriate error messages.
 *
 * @param {number} statusCode - The HTTP status code associated with the error.
 * @param {string} [errorCode] - (Optional) A specific error code to use in the response.
 * @param {string} [errorMessage] - (Optional) A specific error message to use in the response.
 * @returns {iResponseError} The constructed error response object.
 */
function buildErrorResponse(
	statusCode: number,
	errorCode?: string,
	errorMessage?: string
): iResponseError {
	if (errorCode && errorMessage) {
		return {
			error: errorCode,
			message: errorMessage,
			details: null,
		};
	}

	switch (statusCode) {
		case httpStatusCodes.CLIENT_ERROR_BAD_REQUEST:
			return {
				error: "BAD_REQUEST",
				message: "Bad request",
				details: null,
			};

		case httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED:
			return {
				error: "UNAUTHORIZED",
				message: "Unauthorized",
				details: null,
			};

		case httpStatusCodes.CLIENT_ERROR_FORBIDDEN:
			return {
				error: "FORBIDDEN",
				message: "Forbidden",
				details: null,
			};

		case httpStatusCodes.CLIENT_ERROR_NOT_FOUND:
			return {
				error: "NOT_FOUND",
				message: "Not found",
				details: null,
			};

		case httpStatusCodes.CLIENT_ERROR_UNPROCESSABLE_ENTITY:
			return {
				error: "UNPROCESSABLE_ENTITY",
				message: "Unprocessable entity",
				details: null,
			};

		case httpStatusCodes.CLIENT_ERROR_TOO_MANY_REQUESTS:
			return {
				error: "TOO_MANY_REQUESTS",
				message: "Too many requests",
				details: null,
			};

		case httpStatusCodes.SERVER_ERROR_INTERNAL_SERVER_ERROR:
			return {
				error: "INTERNAL_SERVER_ERROR",
				message: "Internal server error",
				details: null,
			};

		default:
			return {
				error: "AUTH_ERROR",
				message: "Authentication error",
				details: null,
			};
	}
}

/**
 * Copies all headers from a Better Auth Response object to the Express response.
 *
 * This utility ensures that any headers set by the Better Auth handler (such as authentication tokens,
 * CORS headers, or custom metadata) are preserved and forwarded to the client in the API response.
 * It is especially important for propagating headers like `Set-Cookie`, `Authorization`, or any
 * custom headers that Better Auth may use for session management or client-side state.
 *
 * The function iterates over all headers present in the Better Auth Response and sets them on the
 * Express response. Headers that are typically managed by Express (content-type, content-length)
 * are skipped to avoid conflicts.
 *
 * @param {Response} response - The Response object returned by the Better Auth handler, containing headers to copy.
 * @param {ExpressResponse} expressRes - The Express Response object representing the current API request/response cycle.
 * @param {string[]} [skipHeaders] - Optional array of header names (lowercase) to skip. Defaults to ['content-type', 'content-length'].
 * @returns {void} This function does not return a value; it mutates the Express response by setting headers.
 */
function copyHeadersFromResponse(
	response: Response,
	expressRes: ExpressResponse,
	skipHeaders: string[] = ["content-type", "content-length"]
): void {
	if (!response.headers) {
		return;
	}

	for (const [key, value] of response.headers.entries()) {
		// Skip headers that are typically managed by Express
		if (!skipHeaders.includes(key.toLowerCase())) {
			expressRes.setHeader(key, value);
		}
	}
}

export default {
	safelyParseBodyFromResponse,
	buildErrorResponse,
	copyHeadersFromResponse,
};
