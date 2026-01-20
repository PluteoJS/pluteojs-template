import type express from "express";

import Logger from "@loaders/logger";
import loadExpress from "@loaders/expressLoader";
import loadBetterAuth from "@loaders/betterAuthLoader";

const loader = async ({
	expressApp,
}: {
	expressApp: express.Application;
}): Promise<void> => {
	// Configure better-auth email handlers before loading express routes
	loadBetterAuth();

	// loading express...
	await loadExpress({app: expressApp});
	Logger.loggerInstance.info("Express loaded");
};

export default loader;
