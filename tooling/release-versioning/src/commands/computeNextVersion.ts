import {Bumper} from "conventional-recommended-bump";
import type {ReleaseType} from "semver";
import * as SemVer from "semver";
import {getCurrentVersion} from "../util/packageJsonUtil.js";

/**
 * Computes the next version based on the current version and the conventional recommended bump.
 * @param currentVersion - The current version.
 * @returns - A promise that resolves with the next version.
 */
async function computeNextVersion(currentVersion: string): Promise<string> {
	const bumper = new Bumper(process.cwd()).loadPreset("angular");
	const recommendation = await bumper.bump();

	const releaseType = recommendation.releaseType as ReleaseType | undefined;
	if (releaseType === undefined) {
		throw new Error("No recommended release type found");
	}

	const nextVersion =
		SemVer.valid(releaseType) || SemVer.inc(currentVersion, releaseType);

	if (!nextVersion) {
		throw new Error(`Invalid nextVersion: ${nextVersion}`);
	}

	return nextVersion;
}

/**
 * Computes the next version based on the current version and the conventional recommended bump.
 */
computeNextVersion(getCurrentVersion())
	.then((nextVersion) => {
		console.log(nextVersion);
	})
	.catch((err) => {
		console.error(err);
	});
