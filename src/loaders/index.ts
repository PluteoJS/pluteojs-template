import express from "express";

import Logger from "@loaders/logger";
import loadExpress from "@loaders/expressLoader";

const loader = async ({
	expressApp,
}: {
	expressApp: express.Application;
}): Promise<void> => {
	// loading express...
	await loadExpress({app: expressApp});
	Logger.loggerInstance.info("✅ Express loaded");
};

export default loader;
