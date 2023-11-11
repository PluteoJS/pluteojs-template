import PackageJSON from "../../package.json";

/**
 * Returns the current version from package.json.
 * @returns - The current version.
 */
function getCurrentVersion() {
	return PackageJSON.version;
}

export {getCurrentVersion};
