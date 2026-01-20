import type {Router, Request, Response} from "express";
import {fromNodeHeaders} from "better-auth/node";
import {auth, isEndpointAllowed} from "@pluteojs/better-auth";

import config from "@config";
import logger from "@loaders/logger";
import expressUtil from "@util/expressUtil";
import betterAuthUtil from "@util/betterAuthUtil";
import {httpStatusCodes} from "@customTypes/networkTypes";
import type {iResponseError} from "@customTypes/responseTypes";
import {RequestHeaders} from "@constants/serverConstants";

/**
 * Better Auth route handler.
 * Mounts better-auth and handles all /auth/* endpoints.
 *
 * Features:
 * - Endpoint allowlist for security
 * - Response envelope wrapping (configurable)
 * - Header preservation (for cookies)
 *
 * @param route - Express router
 */
export default (route: Router): void => {
	// Use regex pattern for catch-all route (path-to-regexp v8+ doesn't support /auth/*)
	route.all(/^\/auth\/.*/, async (req: Request, res: Response) => {
		const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
		const enableEnvelope = config.betterAuth.enableResponseEnvelope;

		logger.debug(uniqueRequestId, "Better Auth request received", null, {
			method: req.method,
			path: req.path,
		});

		/**
		 * Helper: Copy headers from better-auth response.
		 * Important for Set-Cookie headers!
		 */
		const copyHeaders = (authResponse: globalThis.Response): void => {
			betterAuthUtil.copyHeadersFromResponse(authResponse, res);
		};

		/**
		 * Helper: Send success response (respects envelope setting)
		 */
		const sendSuccess = (statusCode: number, data: unknown, authResponse?: globalThis.Response): Response<unknown> => {
			if (authResponse) {copyHeaders(authResponse);}

			if (enableEnvelope) {
				return res.ok(data, statusCode as httpStatusCodes);
			}
			return res.status(statusCode).json(data);
		};

		/**
		 * Helper: Send error response (respects envelope setting)
		 */
		const sendError = (
			statusCode: number,
			error: {code?: string; message?: string},
			authResponse?: globalThis.Response
		): Response<unknown> => {
			if (authResponse) {copyHeaders(authResponse);}

			if (enableEnvelope) {
				const responseError: iResponseError = betterAuthUtil.buildErrorResponse(
					statusCode,
					error.code,
					error.message
				);
				return res.fail(responseError, statusCode as httpStatusCodes);
			}
			return res.status(statusCode).json(error);
		};

		// Step 1: Check endpoint allowlist
		const authPath = req.path; // e.g., "/auth/sign-in/email"
		const allowedEndpoints = Object.keys(config.betterAuth.allowedEndpoints).length > 0
			? config.betterAuth.allowedEndpoints
			: undefined; // Use defaults if empty

		if (!isEndpointAllowed(authPath, req.method, allowedEndpoints)) {
			logger.warning(uniqueRequestId, "Blocked request to non-allowed endpoint", null, {
				path: authPath,
				method: req.method,
			});
			return sendError(httpStatusCodes.CLIENT_ERROR_NOT_FOUND, {
				code: "ENDPOINT_NOT_FOUND",
				message: "Endpoint not found",
			});
		}

		// Step 2: Process better-auth request
		try {
			// Create Web Request from Express request
			const protocol = req.protocol || "http";
			const host = req.get("host") || "localhost";
			const url = new URL(req.originalUrl, `${protocol}://${host}`);

			// Use fromNodeHeaders to properly convert Node.js headers (handles cookies, arrays, etc.)
			const headers = fromNodeHeaders(req.headers);

			/**
			 * Propagate the request ID to the headers for downstream Better Auth plugin callbacks.
			 *
			 * The request ID is parsed from the incoming request by our middleware, but needs to be
			 * explicitly set in the Web Request headers. By setting the "X-Request-Id" header here,
			 * we ensure that any Better Auth plugin (such as sendInvitationEmail handler of the
			 * organization plugin, etc.) that receives the request object can access the request ID
			 * for logging and tracing purposes.
			 *
			 * This improves observability and makes it easier to correlate logs across the
			 * authentication flow.
			 */
			if (uniqueRequestId) {
				headers.set(RequestHeaders.REQUEST_ID, uniqueRequestId);
			}

			const webRequest = new Request(url.toString(), {
				method: req.method,
				headers,
				body: ["GET", "HEAD"].includes(req.method)
					? undefined
					: JSON.stringify(req.body),
			});

			const authResponse = await auth.handler(webRequest);

			// Parse response body safely (handles null bodies and JSON parse errors)
			const contentType = authResponse.headers.get("content-type") || "";
			let body: unknown;

			if (contentType.includes("application/json")) {
				body = await betterAuthUtil.safelyParseBodyFromResponse(authResponse);
			} else {
				body = await authResponse.text();
			}

			// Step 3: Send response with headers preserved
			if (authResponse.ok) {
				logger.debug(uniqueRequestId, "Better Auth request successful", null, {
					status: authResponse.status,
				});
				return sendSuccess(authResponse.status, body, authResponse);
			} else {
				logger.debug(uniqueRequestId, "Better Auth request failed", null, {
					status: authResponse.status,
					error: body,
				});
				return sendError(
					authResponse.status,
					body as {code?: string; message?: string},
					authResponse
				);
			}
		} catch (error) {
			logger.error(uniqueRequestId, "Better Auth handler error", error);
			return sendError(httpStatusCodes.SERVER_ERROR_INTERNAL_SERVER_ERROR, {
				code: "INTERNAL_ERROR",
				message: "Authentication service error",
			});
		}
	});
};
