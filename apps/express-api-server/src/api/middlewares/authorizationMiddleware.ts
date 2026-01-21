import type {Request, Response, NextFunction} from "express";
import {fromNodeHeaders} from "better-auth/node";
import {auth} from "@pluteojs/better-auth";

import config from "@config";
import {httpStatusCodes} from "@customTypes/networkTypes";
import {genericServiceErrors} from "@constants/errors/genericServiceErrors";
import logger from "loaders/logger";
import expressUtil from "util/expressUtil";

/**
 * Authorization middleware using better-auth.
 * Verifies the session from cookies or Authorization header.
 *
 * On success, attaches session and user to the request object.
 */
export const isAuthorized = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response<unknown>> => {
	const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

	try {
		// Get session from better-auth using request headers
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});

		if (!session || !session.user) {
			const enableEnvelope = config.betterAuth.enableResponseEnvelope;

			if (enableEnvelope) {
				return res.fail(
					genericServiceErrors.auth.NoAuthorizationToken,
					httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED
				);
			}
			return res.status(httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED).json({
				error: "Unauthorized",
				message: "No valid session found",
			});
		}

		// Attach session and user to request for use in route handlers
		req.session = session.session;
		req.user = session.user;

		next();
	} catch (error) {
		logger.error(
			uniqueRequestId,
			"Exception in authorizationMiddleware.isAuthorized()",
			error
		);

		const enableEnvelope = config.betterAuth.enableResponseEnvelope;

		if (enableEnvelope) {
			return res.fail(
				genericServiceErrors.auth.NoAuthorizationToken,
				httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED
			);
		}
		return res.status(httpStatusCodes.CLIENT_ERROR_UNAUTHORIZED).json({
			error: "Unauthorized",
			message: "Session verification failed",
		});
	}
};
