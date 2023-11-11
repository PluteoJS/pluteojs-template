import {NextFunction, Router} from "express";

import logger from "@loaders/logger";

import middlewares from "@api/middlewares";

import UsersService from "@services/UsersService";

import expressUtil from "@util/expressUtil";

import {iRequest, iResponse, RouteType} from "@customTypes/expressTypes";
import {iUser} from "@customTypes/appDataTypes/userTypes";

const route = Router();
const userService = new UsersService();

const userRoute: RouteType = (apiRouter) => {
	apiRouter.use("/users", route);

	/*
		Registering isAuthorized middleware to the entire /users route
		as all the endpoint in this route needs authorization.
	*/
	route.use(middlewares.isAuthorized);

	route.get(
		"/",
		async (req: iRequest, res: iResponse<iUser>, next: NextFunction) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling GET:/users endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			try {
				const {decodedAccessToken} = req;
				const {uid: userId} = decodedAccessToken;

				const result = await userService.getUserDetails(
					uniqueRequestId,
					userId
				);

				logger.debug(
					uniqueRequestId,
					"GET:/users:: Completed userService.getUserDetails & sending result to client:",
					null,
					{
						result,
					}
				);

				const {httpStatusCode} = result;

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(uniqueRequestId, "Error on GET:/users:", error);

				return next(error);
			}
		}
	);
};

export default userRoute;
