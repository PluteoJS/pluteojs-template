import {NextFunction, Router} from "express";
import {celebrate, Segments} from "celebrate";

import logger from "@loaders/logger";

import AuthService from "@services/AuthService";

import expressUtil from "@util/expressUtil";

import {iRequest, iResponse, RouteType} from "@customTypes/expressTypes";
import {
	renewAccessTokenBodySchema,
	signinBodySchema,
	signupBodySchema,
	resetPasswordRequestSchema,
	resetPasswordBodySchema,
} from "@validations/authRouteSchemas";
import {iUser, iUserInputDTO} from "@customTypes/appDataTypes/userTypes";
import {
	iCredentials,
	iTokenPair,
	iResetPassRequestPayload,
	iResetPassPayload,
} from "@customTypes/appDataTypes/authTypes";
import {iServiceSuccess} from "@customTypes/commonServiceTypes";

const route = Router();
const authService = new AuthService();

const authRoute: RouteType = (apiRouter) => {
	apiRouter.use("/auth", route);

	route.post(
		"/signup",
		celebrate({
			[Segments.BODY]: signupBodySchema,
		}),
		async (
			req: iRequest<iUserInputDTO>,
			res: iResponse<{
				user: iUser;
				tokens: iTokenPair;
			}>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling POST:/auth/signup endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			try {
				const {body} = req;

				const result = await authService.signUp(uniqueRequestId, body);

				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/auth/signup :: Completed authService.signUp & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(uniqueRequestId, "Error on POST:/auth/signup:", error);

				return next(error);
			}
		}
	);

	route.post(
		"/signin",
		celebrate({
			[Segments.BODY]: signinBodySchema,
		}),
		async (
			req: iRequest<iCredentials>,
			res: iResponse<iTokenPair>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling POST:/auth/signin endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			try {
				const {body} = req;
				const {email, password} = body;

				const result = await authService.signIn(
					uniqueRequestId,
					email,
					password
				);

				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/auth/signin :: Completed authService.signIn & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(uniqueRequestId, "Error on POST:/auth/signin:", error);

				return next(error);
			}
		}
	);

	route.post(
		"/renew-access-token",
		celebrate({
			[Segments.BODY]: renewAccessTokenBodySchema,
		}),
		async (
			req: iRequest<{
				refreshToken: string;
			}>,
			res: iResponse<iTokenPair>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
			logger.debug(
				uniqueRequestId,
				"Calling POST:/auth/renew-access-token endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			try {
				const {body} = req;
				const {refreshToken} = body;

				const result = await authService.renewAccessToken(
					uniqueRequestId,
					refreshToken
				);

				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/auth/renew-access-token :: Completed authService.renewAccessToken & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on POST:/auth/renew-access-token:",
					error
				);

				return next(error);
			}
		}
	);

	route.post(
		"/request-reset-password",
		celebrate({
			[Segments.BODY]: resetPasswordRequestSchema,
		}),
		async (
			req: iRequest<iResetPassRequestPayload>,
			res: iResponse<null>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling POST:/auth/request-reset-password endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			try {
				const {body} = req;
				const {email} = body;
				const ipAddress = expressUtil.getClientIp(req);

				const result = await authService.requestResetPassword(
					uniqueRequestId,
					email,
					ipAddress
				);
				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/auth/request-reset-password :: Completed authService.requestResetPassword & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on POST:/auth/request-reset-password:",
					error
				);

				return next(error);
			}
		}
	);

	route.post(
		"/reset-password",
		celebrate({
			[Segments.BODY]: resetPasswordBodySchema,
		}),
		async (
			req: iRequest<iResetPassPayload>,
			res: iResponse<iServiceSuccess>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling POST:/auth/reset-password endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			try {
				const {body} = req;
				const {email, otp, newPassword} = body;

				const result = await authService.resetPassword(
					uniqueRequestId,
					email,
					otp,
					newPassword
				);
				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/auth/reset-password :: Completed authService.resetPassword & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on POST:/auth/reset-password:",
					error
				);

				return next(error);
			}
		}
	);
};

export default authRoute;
