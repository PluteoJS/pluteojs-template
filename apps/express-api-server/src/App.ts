import cluster from "cluster";
import os from "os";

import express from "express";

import config from "@config";
import logger from "@loaders/logger";

import appUtil from "./util/appUtil";

/**
 * Starts the server node.
 *
 * @returns {Promise<void>} A promise that resolves when the server is started.
 */
async function startServerNode(): Promise<void> {
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
			${config.serviceInfo.name} API Service Running at: http://localhost:${config.port}
			###################################################################
			`
			)
			.on("error", (error) => {
				logger.loggerInstance.error(error);

				process.exit(1);
			});
	});
}

/**
 * Handles the starting of the server based on the clustering configuration.
 * If clustering is enabled, the Primary process will fork Worker processes.
 * If clustering is disabled, the server will start without forking Worker processes.
 */
async function startServer(): Promise<void> {
	if (config.clusterOptions.hasClusteringEnabled) {
		logger.info(
			null,
			"Clustering is enabled. Starting the server with Worker processes."
		);
		/**
		 * cluster.isPrimary is true when the current process is the Primary process.
		 * The Primary process is responsible for creating Worker processes and managing them.
		 */
		if (cluster.isPrimary) {
			/**
			 * os.cpus() returns the information of the CPUs available on the system.
			 * We're using the length of the CPUs to determine the number of Worker processes to fork.
			 * We're forking the number of Worker processes equal to the number of CPUs available on the system.
			 */
			const numCPUs = os.cpus().length;

			/**
			 * Determine the maximum number of Worker processes to fork based on the number of available CPUs.
			 * NOTE: In development mode, the maximum worker count is limited to 1 regardless of the number of available CPUs.
			 */
			const maxWorkers = appUtil.getMaxWorkerCount(numCPUs);

			logger.info(null, `Primary ${process.pid} is running`);
			logger.info(null, `Number of CPUs available: ${numCPUs}`);
			logger.info(null, `Primary process is forking ${maxWorkers} workers`);

			for (let i = 0; i < maxWorkers; i += 1) {
				cluster.fork();
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			cluster.on("exit", (worker, code, signal) => {
				logger.info(
					null,
					`Worker ${worker.process.pid} died, starting a new worker`
				);

				cluster.fork();
			});
		} else {
			// Worker process: start the server
			logger.info(null, `Worker ${process.pid} started`);

			await startServerNode();
		}
	} else {
		/**
		 * If clustering is disabled, start the server without forking Worker processes.
		 */
		logger.info(
			null,
			"Clustering is disabled. Starting the server without forking Worker processes."
		);

		await startServerNode();
	}
}

void startServer();
