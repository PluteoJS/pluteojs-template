import type {Router, Response, NextFunction} from "express";

import {isAuthorized} from "@api/middlewares/authorizationMiddleware";
import logger from "@loaders/logger";
import expressUtil from "@util/expressUtil";
import UsersService from "@services/UsersService";

import type {iRequest} from "@customTypes/expressTypes";

const usersService = new UsersService();

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
