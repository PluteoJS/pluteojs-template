import {Router} from "express";

import betterAuthRoute from "@api/routes/betterAuthRoute";
import userRoute from "@api/routes/usersRoute";
import verificationRoute from "@api/routes/verificationRoute";

// Legacy auth route - DEPRECATED: Use betterAuthRoute instead
// import authRoute from "@api/routes/authRoute";

/**
 * Returns the configured API router with all routes attached.
 */
export default (): Router => {
	const apiRouter = Router();

	// Better Auth handles all /auth/* endpoints
	betterAuthRoute(apiRouter);

	userRoute(apiRouter);
	verificationRoute(apiRouter);

	return apiRouter;
};
