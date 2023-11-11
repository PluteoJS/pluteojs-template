import {getCurrentBranchName, renameGitBranch} from "../util/GitUtil";
import {getCurrentVersion} from "../util/PackageJsonUtil";

async function fixGitFlowReleaseBranchName() {
	const currentBranch = await getCurrentBranchName();
	const currentVersion = getCurrentVersion();

	if (currentBranch.startsWith("release/")) {
		const newBranchName = `release/${currentVersion}`;

		if (currentBranch === newBranchName) {
			console.log(
				`Current branch name "${currentBranch}" and new branch name "${newBranchName}" are the same.\n⚠️ Aborting fixGitFlowReleaseBranchName.`
			);
			return;
		}

		await renameGitBranch(currentBranch, newBranchName);
		console.log("✅ fixGitFlowReleaseBranchName completed successfully.");
	} else {
		console.log(
			"Current branch is not a release branch.\n⚠️ Aborting fixGitFlowReleaseBranchName."
		);
	}
}

fixGitFlowReleaseBranchName();
