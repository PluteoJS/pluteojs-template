declare namespace NodeJS {
	/*
		NOTE: The naming-convention rule has been disabled for this line because
		ProcessEnv is part of @types/node and can't be renamed to
		iProcessEnv
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export interface ProcessEnv {
		CUSTOM_TEMPLATE_SPECIFIC_ENV_VAR: string;

		// Service Info
		SERVICE_NAME: string;

		// Determines if clustering is enabled or not
		// This is used to determine if the server should run in a single process
		// or if it should use the cluster module to fork multiple processes
		// This is useful for load balancing and improving performance
		// when running on multi-core systems
		// This is set to true by default, but can be overridden in the .env file
		HAS_CLUSTERING_ENABLED: string;
	}
}
