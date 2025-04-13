import express from "express";

import config from "@config";
import logger from "@loaders/logger";

async function startServer(): Promise<void> {
	const app = express();

	// Perform the dynamic import when needed
	const loaders = await import("@loaders/index");
	await loaders.default({expressApp: app});

	app.listen(config.port, () => {
		logger
			.info(
				null,
				`
			###################################################################
			🚀 PluteoJS Server Running at: http://localhost:${config.port} 🚀
			###################################################################
			`
			)
			.on("error", (error) => {
				logger.loggerInstance.error(error);

				process.exit(1);
			});
	});
}

void startServer();
