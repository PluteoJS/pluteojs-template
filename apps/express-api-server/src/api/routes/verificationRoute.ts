import type {Router, Response, NextFunction} from "express";

import {emailVerificationRequestBodySchema} from "@pluteojs/api-types";

import {validateBody} from "@validations/zodValidation";
import logger from "@loaders/logger";
import expressUtil from "@util/expressUtil";
import VerificationService from "@services/VerificationService";

import type {iRequest} from "@customTypes/expressTypes";
import type {iRequestEmailVerificationDTO} from "@customTypes/appDataTypes/verificationTypes";

const verificationService = new VerificationService();

/**
 * Verification route handler.
 *
 * @param route - Express router
 */
export default (route: Router): void => {
	/**
	 * POST /verification/request-email-verification
	 * Requests email verification.
	 */
	route.post(
		"/verification/request-email-verification",
		validateBody(emailVerificationRequestBodySchema),
		async (
			req: iRequest<iRequestEmailVerificationDTO>,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Email verification request received",
				null,
				{email: req.body.email}
			);

			try {
				const {email} = req.body;
				const ipAddress = expressUtil.getClientIp(req);

				await verificationService.requestEmailVerification(email, ipAddress);
				res.ok(null);
			} catch (error) {
				next(error);
			}
		}
	);
};
