/**
 * Returns whether the app is currently running on the "development"
 * environment or not.
 *
 * @returns isDev
 */
function isDev(): boolean {
	return process.env.NODE_ENV === "development";
}

export default {
	isDev,
};
