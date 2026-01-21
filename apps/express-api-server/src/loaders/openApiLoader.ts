import type {Application} from "express";

import {serverModes} from "@constants/serverConstants";
import Logger from "@loaders/logger";
import {mountDocsHub} from "@api/routes/docsHubRoute";

/**
 * Checks if the current environment is a development environment.
 */
const isDevelopment = (): boolean => {
	const env = process.env.NODE_ENV;
	return env === serverModes.DEVELOPMENT_LOCAL || env === serverModes.DEVELOPMENT;
};

/**
 * Loads OpenAPI documentation routes (development only).
 *
 * Documentation endpoints:
 * - GET /api/docs - Documentation hub (links to all versions)
 * - GET /api/v1/openapi.json - Returns the v1 OpenAPI spec
 * - GET /api/v1/docs - Scalar API Reference UI for v1
 * - GET /api/v1/auth/reference - Better-auth documentation for v1
 *
 * @param app - Express application instance
 */
export async function loadOpenApi(app: Application): Promise<void> {
	if (!isDevelopment()) {
		Logger.loggerInstance.info("OpenAPI docs disabled in non-development environment");
		return;
	}

	try {
		// Mount documentation hub at /api/docs
		mountDocsHub(app);
		Logger.loggerInstance.info("Documentation hub available at /api/docs");

		// Dynamic imports to avoid loading these in production
		const {apiReference} = await import("@scalar/express-api-reference");
		const {generateOpenApiDocument} = await import("@openapi/generator");

		// Import routes to trigger registry population
		// (Routes call registry.registerPath when imported)
		// Note: Auth routes are documented via better-auth's /auth/reference endpoint
		await import("@api/routes/v1/usersRoute");
		await import("@api/routes/v1/verificationRoute");

		const spec = generateOpenApiDocument();

		// Serve OpenAPI JSON spec at versioned path
		app.get("/api/v1/openapi.json", (req, res) => {
			void req; // unused
			res.json(spec);
		});

		// Serve Scalar API Reference UI at versioned path
		app.use(
			"/api/v1/docs",
			apiReference({
				url: "/api/v1/openapi.json",
				theme: "default",
			})
		);

		Logger.loggerInstance.info("OpenAPI docs available at /api/v1/docs");
	} catch (error) {
		Logger.loggerInstance.error("Failed to load OpenAPI documentation", {error});
	}
}

export default loadOpenApi;
