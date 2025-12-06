import type {Router, Response, NextFunction} from "express";

import {
	signupBodySchema,
	signinBodySchema,
	renewAccessTokenBodySchema,
	resetPasswordRequestSchema,
	createResetPasswordBodySchema,
} from "@pluteojs/api-types";

import {validateBody} from "@validations/zodValidation";
import config from "@config";
import logger from "@loaders/logger";
import expressUtil from "@util/expressUtil";
import AuthService from "@services/AuthService";

import type {iRequest} from "@customTypes/expressTypes";
import type {
	iUserInputDTO,
	iCredentials,
	iResetPassRequestPayload,
	iResetPassPayload,
} from "@customTypes/index";

const authService = new AuthService();

/**
 * Auth route handler.
 *
 * @param route - Express router
 */
export default (route: Router): void => {
	/**
	 * POST /auth/signup
	 * Creates a new user account.
	 */
	route.post(
		"/auth/signup",
		validateBody(signupBodySchema),
		async (
			req: iRequest<iUserInputDTO>,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(uniqueRequestId, "Signup request received", null, {
				requestBody: req.body,
			});

			try {
				const result = await authService.signUp(uniqueRequestId, req.body);
				const {httpStatusCode} = result;

				res.status(httpStatusCode).json(result);
			} catch (error) {
				next(error);
			}

			return;
		}
	);

	/**
	 * POST /auth/signin
	 * Authenticates a user and returns tokens.
	 */
	route.post(
		"/auth/signin",
		validateBody(signinBodySchema),
		async (
			req: iRequest<iCredentials>,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(uniqueRequestId, "Signin request received", null, {
				email: req.body.email,
			});

			try {
				const {email, password} = req.body;
				const result = await authService.signIn(uniqueRequestId, email, password);
				const {httpStatusCode} = result;

				res.status(httpStatusCode).json(result);
			} catch (error) {
				next(error);
			}

			return;
		}
	);

	/**
	 * POST /auth/renew-access-token
	 * Renews the access token using refresh token.
	 */
	route.post(
		"/auth/renew-access-token",
		validateBody(renewAccessTokenBodySchema),
		async (
			req: iRequest<{refreshToken: string}>,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(uniqueRequestId, "Renew access token request received");

			try {
				const {refreshToken} = req.body;
				const result = await authService.renewAccessToken(
					uniqueRequestId,
					refreshToken
				);
				const {httpStatusCode} = result;

				res.status(httpStatusCode).json(result);
			} catch (error) {
				next(error);
			}

			return;
		}
	);

	/**
	 * POST /auth/request-reset-password
	 * Initiates password reset process.
	 */
	route.post(
		"/auth/request-reset-password",
		validateBody(resetPasswordRequestSchema),
		async (
			req: iRequest<iResetPassRequestPayload>,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Reset password request received",
				null,
				{email: req.body.email}
			);

			try {
				const {email} = req.body;
				const ipAddress = expressUtil.getClientIp(req);

				const result = await authService.requestResetPassword(
					uniqueRequestId,
					email,
					ipAddress
				);
				const {httpStatusCode} = result;

				res.status(httpStatusCode).json(result);
			} catch (error) {
				next(error);
			}

			return;
		}
	);

	/**
	 * POST /auth/reset-password
	 * Resets the password using OTP.
	 */
	const resetPasswordBodySchema = createResetPasswordBodySchema(
		config.resetPasswordConfig.otpLength
	);

	route.post(
		"/auth/reset-password",
		validateBody(resetPasswordBodySchema),
		async (
			req: iRequest<iResetPassPayload>,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(uniqueRequestId, "Reset password confirmation received");

			try {
				const {email, otp, newPassword} = req.body;
				const result = await authService.resetPassword(
					uniqueRequestId,
					email,
					otp,
					newPassword
				);
				const {httpStatusCode} = result;

				res.status(httpStatusCode).json(result);
			} catch (error) {
				next(error);
			}

			return;
		}
	);
};
