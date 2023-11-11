import SimpleGit from "simple-git";

/**
 * Returns the current branch name.
 * @returns - A promise that resolves with the current branch name.
 */
async function getCurrentBranchName(): Promise<string> {
	const simpleGit = SimpleGit();

	try {
		const branchSummary = await simpleGit.branchLocal();

		// Extract the current branch name from the branch summary
		const currentBranch = branchSummary.current;

		return currentBranch;
	} catch (error) {
		console.error("An error occurred:", error);
		return "";
	}
}

/**
 * Checks if a branch exists in the remote repository.
 * @param branchName - The name of the branch to check.
 * @returns - A boolean value indicating if the branch exists in the remote repository.
 */
async function checkIfBranchExistsInRemote(
	branchName: string
): Promise<boolean> {
	const simpleGit = SimpleGit();

	try {
		// Fetch all branches from the remote repository
		await simpleGit.fetch();

		// Get a summary of all branches from the remote repository.
		const branchSummary = await simpleGit.branch(["-r", "--no-abbrev"]);

		// Check if the branch exists in the remote repository
		const isPushed = branchSummary.all.some((branch) => {
			if (branch === `origin/${branchName}`) {
				return true;
			}

			return false;
		});

		return isPushed;
	} catch (error) {
		console.error("An error occurred:", error);
		return false;
	}
}

/**
 * Checks if a branch exists in the local repository.
 * @param branchName - The name of the branch to check.
 * @returns - A boolean value indicating if the branch exists in the local repository.
 */
async function checkIfBranchExistsInLocal(
	branchName: string
): Promise<boolean> {
	const simpleGit = SimpleGit();

	try {
		const branchSummary = await simpleGit.branchLocal();

		return branchSummary.branches.hasOwnProperty(branchName);
	} catch (error) {
		console.error("Exception on isBranchLocal:", error);
		return false;
	}
}

/**
 * Deletes a local branch.
 * @param branchName - The name of the branch to delete.
 * @returns - A promise that resolves when the branch is deleted.
 */
async function deleteLocalBranch(branchName: string): Promise<void> {
	const simpleGit = SimpleGit();

	try {
		const isBranchExistsInLocal = await checkIfBranchExistsInLocal(branchName);

		if (!isBranchExistsInLocal) {
			console.error(
				`Local branch "${branchName}" does not exist.\n⚠️ Aborting deleteLocalBranch.`
			);
			return;
		}

		await simpleGit.deleteLocalBranch(branchName);
		console.log(`Local branch "${branchName}" deleted successfully.`);
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

/**
 * Deletes a remote branch.
 * @param branchName - The name of the branch to delete.
 * @returns - A promise that resolves when the branch is deleted.
 */
async function deleteRemoteBranch(branchName: string): Promise<void> {
	const simpleGit = SimpleGit();

	try {
		const remoteBranchExists = checkIfBranchExistsInRemote(branchName);

		if (!remoteBranchExists) {
			console.error(`Remote branch "${branchName}" does not exist.`);
			return;
		}

		await simpleGit.push("origin", `:${branchName}`);

		console.log(`Remote branch "${branchName}" deleted successfully.`);
	} catch (error) {
		console.error("Exception on deleteRemoteBranch: ", error);
	}
}

/**
 * Deletes a branch locally and remotely.
 * @param branchName - The name of the branch to delete.
 * @returns - A promise that resolves when the branch is deleted.
 */
async function deleteGitBranchLocallyAndRemotely(
	branchName: string
): Promise<void> {
	const simpleGit = SimpleGit();

	try {
		const isBranchExistsInLocal = await checkIfBranchExistsInLocal(branchName);

		if (!isBranchExistsInLocal) {
			console.error(
				`Local branch "${branchName}" does not exist.\n⚠️ Aborting deleteGitBranchLocallyAndRemotely.`
			);
			return;
		}

		const isRemoteBranch = await checkIfBranchExistsInRemote(branchName);

		if (isRemoteBranch) {
			await deleteRemoteBranch(branchName);
		}

		await deleteLocalBranch(branchName);
	} catch (error) {
		console.error("Exception on deleteGitBranchLocallyAndRemotely: ", error);
	}
}

/**
 * Renames a branch locally and remotely.
 * @param currentBranchName - The name of the branch to rename.
 * @param newBranchName - The new name of the branch.
 * @returns - A promise that resolves when the branch is renamed.
 */
async function renameGitBranch(
	currentBranchName: string,
	newBranchName: string
): Promise<void> {
	const simpleGit = SimpleGit();

	try {
		if (currentBranchName === newBranchName) {
			console.error(
				`Current branch name "${currentBranchName}" and new branch name "${newBranchName}" are the same.\n⚠️ Aborting renameGitBranch.`
			);
			return;
		}

		const isBranchExistsInLocal = await checkIfBranchExistsInLocal(
			currentBranchName
		);

		if (!isBranchExistsInLocal) {
			console.error(
				`Branch "${currentBranchName}" does not exist locally.\n⚠️ Aborting renameGitBranch.`
			);
			return;
		}

		// Rename the branch locally
		await simpleGit.checkout(currentBranchName); // Switch to the current branch
		await simpleGit.branch(["-m", newBranchName]); // Rename the branch locally

		console.log(
			`Branch "${currentBranchName}" renamed to "${newBranchName}" locally.`
		);

		const isRemoteBranch = await checkIfBranchExistsInRemote(currentBranchName);

		if (isRemoteBranch) {
			// Rename the remote branch
			await deleteRemoteBranch(currentBranchName); // Delete the current remote branch
			await simpleGit.push("origin", newBranchName); // Push the renamed branch to the remote repository

			console.log(
				`Renamed branch "${newBranchName}" pushed to remote successfully.`
			);
		} else {
			console.log(
				`Branch "${currentBranchName}" does not exist in the remote repository. No changes made to the remote repository.`
			);
		}
	} catch (error) {
		console.error("Exception on renameGitBranch:", error);
	}
}

export {
	getCurrentBranchName,
	checkIfBranchExistsInRemote,
	checkIfBranchExistsInLocal,
	deleteLocalBranch,
	deleteRemoteBranch,
	deleteGitBranchLocallyAndRemotely,
	renameGitBranch,
};
