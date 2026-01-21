import type {Router} from "express";

import PackageJSON from "../../../package.json";

/**
 * Health check route handler (unversioned).
 *
 * This route is not versioned and provides a simple health check endpoint
 * at /api/health for load balancers and monitoring systems.
 *
 * @param route - Express router
 */
export default (route: Router): void => {
	/**
	 * GET /health
	 * Health check endpoint for monitoring and load balancers.
	 */
	route.get("/health", (req, res) => {
		const data = {
			status: "healthy",
			name: PackageJSON.name,
			version: PackageJSON.version,
			timestamp: new Date().toISOString(),
		};

		return res.ok(data);
	});
};
