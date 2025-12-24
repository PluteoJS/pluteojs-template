import {readFileSync} from "fs";
import {join} from "path";

/**
 * Returns the current version from the root package.json.
 * @returns - The current version.
 */
function getCurrentVersion(): string {
	const rootPkgPath = join(process.cwd(), "package.json");
	const pkg = JSON.parse(readFileSync(rootPkgPath, "utf-8")) as {
		version: string;
	};
	return pkg.version;
}

export {getCurrentVersion};
