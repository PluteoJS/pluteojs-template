import {Router} from "express";

import authRoute from "@api/routes/authRoute";
import userRoute from "@api/routes/usersRoute";
import verificationRoute from "@api/routes/verificationRoute";

/**
 * Returns the configured API router with all routes attached.
 */
export default (): Router => {
	const apiRouter = Router();

	authRoute(apiRouter);
	userRoute(apiRouter);
	verificationRoute(apiRouter);

	return apiRouter;
};
