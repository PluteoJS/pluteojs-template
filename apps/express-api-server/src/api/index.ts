import {Router} from "express";

import {apiVersioningMiddleware} from "@api/middlewares";
import healthRoute from "@api/routes/healthRoute";
import {registerV1Routes} from "@api/routes/v1";

/**
 * Returns the configured API router with all routes attached.
 *
 * Route structure:
 * - /api/health - Unversioned health check endpoint
 * - /api/v1/* - Version 1 API endpoints (auth, users, verification)
 */
export default (): Router => {
	const apiRouter = Router();

	// Unversioned health check endpoint (for load balancers, monitoring)
	healthRoute(apiRouter);

	// Apply versioning middleware for all versioned routes
	apiRouter.use(apiVersioningMiddleware);

	// Mount v1 routes
	apiRouter.use("/v1", registerV1Routes());

	return apiRouter;
};
