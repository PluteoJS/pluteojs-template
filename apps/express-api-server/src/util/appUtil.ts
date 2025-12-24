import PackageJSON from "../../package.json";

/**
 * Returns whether the app is currently running on the "development"
 * environment or not.
 *
 * @returns isDev
 */
function isDev(): boolean {
	return process.env.NODE_ENV === "development";
}

/**
 * Returns the current version from package.json.
 * @returns - The current version.
 */
function getCurrentVersion(): string {
	return PackageJSON.version;
}

/**
 * Returns the maximum worker count based on the number of available CPUs.
 *
 * In development mode, the maximum worker count is limited to 1 regardless of
 * the number of available CPUs.
 *
 * @param numOfAvailableCPUs - The number of available CPUs.
 * @returns The maximum worker count.
 */
function getMaxWorkerCount(numOfAvailableCPUs: number): number {
	if (isDev()) {
		return 1;
	}

	return numOfAvailableCPUs;
}

export default {
	isDev,
	getCurrentVersion,
	getMaxWorkerCount,
};
