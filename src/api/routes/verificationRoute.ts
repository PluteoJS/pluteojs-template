import {NextFunction, Router} from "express";
import {celebrate, Segments} from "celebrate";

import logger from "@loaders/logger";

import VerificationService from "@services/VerificationService";

import expressUtil from "@util/expressUtil";

import {iRequest, iResponse, RouteType} from "@customTypes/expressTypes";
import {iRequestEmailVerificationDTO} from "@customTypes/appDataTypes/verificationTypes";
import {emailVerificationRequestBodySchema} from "@validations/verificationRouteSchema";

const route = Router();
const verificationService = new VerificationService();

const verificationRoute: RouteType = (apiRouter) => {
	apiRouter.use("/verification", route);

	route.post(
		"/request-email-verification",
		celebrate({
			[Segments.BODY]: emailVerificationRequestBodySchema,
		}),
		async (
			req: iRequest<iRequestEmailVerificationDTO>,
			res: iResponse<boolean>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling POST:/verification/request-email-verification endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			try {
				const {body} = req;
				const {email} = body;
				const ipAddress = expressUtil.getClientIp(req);

				const result = await verificationService.requestEmailVerification(
					uniqueRequestId,
					email,
					ipAddress
				);

				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/verification/request-email-verification :: Completed verificationService.requestEmailVerification & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on POST:/verification/request-email-verification:",
					error
				);

				return next(error);
			}
		}
	);
};

export default verificationRoute;
