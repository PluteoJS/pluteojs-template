import type {Router, Response, NextFunction} from "express";

import {userResponseSchema} from "@pluteojs/api-types";

import {isAuthorized} from "@api/middlewares/authorizationMiddleware";
import logger from "@loaders/logger";
import expressUtil from "@util/expressUtil";
import UsersService from "@services/UsersService";
import {registry} from "@openapi/registry";
import {SuccessEnvelope, ErrorEnvelope} from "@constants/openAPIConstants";

import type {iRequest} from "@customTypes/expressTypes";

const usersService = new UsersService();

// Register OpenAPI documentation for GET /users/
registry.registerPath({
	method: "get",
	path: "/api/users/",
	summary: "Get current user details",
	description: "Retrieves the authenticated user's profile information.",
	tags: ["Users"],
	security: [{bearerAuth: []}],
	responses: {
		200: {
			description: "User details retrieved successfully",
			content: {
				"application/json": {
					schema: SuccessEnvelope(userResponseSchema),
				},
			},
		},
		401: {
			description: "Unauthorized - Invalid or missing token",
			content: {
				"application/json": {
					schema: ErrorEnvelope,
				},
			},
		},
	},
});

/**
 * Users route handler.
 *
 * @param route - Express router
 */
export default (route: Router): void => {
	/**
	 * GET /users/
	 * Gets the current user's details.
	 * Requires authentication.
	 */
	route.get(
		"/users/",
		isAuthorized,
		async (
			req: iRequest,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(uniqueRequestId, "Get user details request received");

			try {
				const userId = req.decodedAccessToken?.uid;

				if (!userId) {
					throw new Error("User ID not found in token");
				}

				const data = await usersService.getUserDetails(userId);
				res.ok(data);
			} catch (error) {
				next(error);
			}
		}
	);
};
