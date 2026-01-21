import type express from "express";

import Logger from "@loaders/logger";
import loadExpress from "@loaders/expressLoader";
import loadBetterAuth from "@loaders/betterAuthLoader";
import {loadOpenApi} from "@loaders/openApiLoader";

const loader = async ({
	expressApp,
}: {
	expressApp: express.Application;
}): Promise<void> => {
	// Configure better-auth email handlers before loading express routes
	loadBetterAuth();

	// Load OpenAPI documentation (dev only, before routes)
	await loadOpenApi(expressApp);

	// loading express...
	await loadExpress({app: expressApp});
	Logger.loggerInstance.info("Express loaded");
};

export default loader;
