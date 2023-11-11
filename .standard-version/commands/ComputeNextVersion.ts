import ConventionalRecommendedBump from "conventional-recommended-bump";
import SemVer from "semver";

import {getCurrentVersion} from "../util/PackageJsonUtil";
import {error} from "console";

/**
 * Computes the next version based on the current version and the conventional recommended bump.
 * @param currentVersion - The current version.
 * @returns - A promise that resolves with the next version.
 */
function ComputeNextVersion(currentVersion: string): Promise<string> {
	return new Promise((resolve, reject) => {
		ConventionalRecommendedBump(
			{
				preset: "angular",
			},
			(error, recommendation) => {
				if (error) {
					reject(error);
					return;
				}

				const recommendedReleaseType = recommendation.releaseType;
				if (recommendedReleaseType === undefined) {
					reject(new Error("No recommended release type found"));
					return;
				}

				const nextVersion =
					SemVer.valid(recommendedReleaseType) ||
					SemVer.inc(currentVersion, recommendedReleaseType);

				if (nextVersion) {
					resolve(nextVersion);
				} else {
					reject(new Error(`Invalid nextVersion: ${nextVersion}`));
					return;
				}
			}
		);
	});
}

/**
 * Computes the next version based on the current version and the conventional recommended bump.
 */
ComputeNextVersion(getCurrentVersion())
	.then((nextVersion) => {
		console.log(nextVersion);
	})
	.catch((err) => {
		console.error(err);
	});
