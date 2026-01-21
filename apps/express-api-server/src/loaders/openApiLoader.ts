import type {Application} from "express";

import {serverModes} from "@constants/serverConstants";
import Logger from "@loaders/logger";

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
 * - GET /api/openapi.json - Returns the OpenAPI spec
 * - GET /docs - Scalar API Reference UI
 *
 * @param app - Express application instance
 */
export async function loadOpenApi(app: Application): Promise<void> {
	if (!isDevelopment()) {
		Logger.loggerInstance.info("OpenAPI docs disabled in non-development environment");
		return;
	}

	try {
		// Dynamic imports to avoid loading these in production
		const {apiReference} = await import("@scalar/express-api-reference");
		const {generateOpenApiDocument} = await import("@openapi/generator");

		// Import routes to trigger registry population
		// (Routes call registry.registerPath when imported)
		await import("@api/routes/v1/usersRoute");
		await import("@api/routes/v1/verificationRoute");
		await import("@api/routes/v1/authRoute");

		const spec = generateOpenApiDocument();

		// Serve OpenAPI JSON spec
		app.get("/api/openapi.json", (req, res) => {
			void req; // unused
			res.json(spec);
		});

		// Serve Scalar API Reference UI
		app.use(
			"/docs",
			apiReference({
				url: "/api/openapi.json",
				theme: "default",
			})
		);

		Logger.loggerInstance.info("OpenAPI docs available at /docs");
	} catch (error) {
		Logger.loggerInstance.error("Failed to load OpenAPI documentation", {error});
	}
}

export default loadOpenApi;
