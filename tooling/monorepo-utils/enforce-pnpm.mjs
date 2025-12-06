#!/usr/bin/env node

/**
 * Package Manager Enforcement Script
 *
 * This script ensures that only pnpm is used for package management in this workspace.
 * It's typically run as a preinstall hook to prevent accidental use of npm or yarn.
 *
 * @fileoverview Enforces pnpm usage by checking the npm_config_user_agent environment variable
 */

/**
 * Gets the user agent string from npm configuration
 * This environment variable is set by npm/yarn/pnpm when running package manager commands
 * Format: "pnpm/8.15.0 npm/? node/v20.10.0 darwin arm64"
 */
const userAgent = process.env.npm_config_user_agent || "";

/**
 * Validates that the current package manager is pnpm
 *
 * The user agent string should start with "pnpm/" if pnpm is being used.
 * If not, we extract the package manager name and show an error message.
 */
if (!userAgent.startsWith("pnpm/")) {
	/**
	 * Extract the package manager name from the user agent string
	 * Example: "npm/9.8.1" -> "npm", "yarn/1.22.19" -> "yarn"
	 */
	const packageManager = userAgent.split(" ")[0] || "unknown";

	// Display a comprehensive error message with installation instructions
	console.error(
		`\nThis workspace uses pnpm. Detected: ${packageManager}.\n\n` +
			"To proceed, install with pnpm (Corepack recommended):\n" +
			"  corepack enable\n" +
			"  pnpm install\n\n" +
			"If you don't have Corepack, install pnpm: https://pnpm.io/installation\n"
	);

	// Exit with error code 1 to prevent the installation from proceeding
	process.exit(1);
}
