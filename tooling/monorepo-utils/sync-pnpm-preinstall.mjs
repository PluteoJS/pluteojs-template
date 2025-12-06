#!/usr/bin/env node

/**
 * @fileoverview Synchronizes preinstall scripts across all packages in the monorepo.
 *
 * This script ensures that all packages in the 'packages' and 'apps' directories
 * have a consistent preinstall script that enforces the use of pnpm as the package manager.
 *
 * The script:
 * - Scans all subdirectories in 'packages' and 'apps'
 * - Updates package.json files to include a preinstall script that runs enforce-pnpm.mjs
 * - Warns about existing preinstall scripts that differ from the expected one
 * - Provides a summary of changes made
 *
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

// Configuration constants
/**
 * @type {string} The root directory of the monorepo
 */
const ROOT = process.cwd();

/**
 * @type {string[]} Target directories to scan for packages
 */
const TARGETS = ["packages", "apps"];

/**
 * @type {string} Path to the enforce-pnpm script relative to the root
 */
const ROOT_SCRIPT = join("scripts", "enforce-pnpm.mjs");

// Statistics tracking
/**
 * @type {number} Number of package.json files that were updated
 */
let changed = 0;

/**
 * @type {number} Number of package.json files that already had the correct preinstall script
 */
let skipped = 0;

/**
 * @type {number} Number of warnings about conflicting preinstall scripts
 */
let warnings = 0;

/**
 * Updates the preinstall script in a package's package.json file.
 *
 * This function:
 * - Reads the package.json file from the specified directory
 * - Ensures the scripts section exists
 * - Calculates the relative path to the enforce-pnpm script
 * - Updates the preinstall script if needed
 * - Warns if there's already a different preinstall script
 *
 * @param {string} pkgDir - The directory containing the package.json file
 * @returns {void}
 */
function updatePackageJson(pkgDir) {
	const pkgJsonPath = join(pkgDir, "package.json");

	// Skip if package.json doesn't exist
	if (!existsSync(pkgJsonPath)) return;

	// Read and parse the package.json file
	const data = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

	/**
	 * Ensure scripts section exists (using logical OR assignment).
	 * If it doesn't exist, initializing it with an empty object.
	 */
	data.scripts ||= {};

	/**
	 * Calculate the relative path from this package to the enforce-pnpm script
	 * Replace backslashes with forward slashes for cross-platform compatibility
	 */
	const rel = relative(pkgDir, join(ROOT, ROOT_SCRIPT)).replace(/\\/g, "/");
	const desired = `node ${rel}`;

	// Check if there's already a preinstall script that differs from what we want
	if (data.scripts.preinstall && data.scripts.preinstall !== desired) {
		console.warn(`warn: ${pkgJsonPath} has a different preinstall: "${data.scripts.preinstall}"`);
		warnings++;
		return; // Do not override existing preinstall scripts
	}

	// Skip if the preinstall script is already correct
	if (data.scripts.preinstall === desired) {
		skipped++;
		return;
	}

	// Update the preinstall script
	data.scripts.preinstall = desired;

	// Write the updated package.json back to disk with proper formatting
	writeFileSync(pkgJsonPath, `${JSON.stringify(data, null, 2)}\n`);
	console.log(`updated: ${pkgJsonPath}`);
	changed++;
}

// Main execution: scan all target directories
for (const base of TARGETS) {
	const baseDir = join(ROOT, base);

	// Skip if the target directory doesn't exist
	if (!existsSync(baseDir)) continue;

	// Iterate through all items in the target directory
	for (const name of readdirSync(baseDir)) {
		const dir = join(baseDir, name);

		try {
			// Only process directories (skip files)
			if (statSync(dir).isDirectory()) {
				updatePackageJson(dir);
			}
		} catch {
			// Silently ignore errors (e.g., permission issues, broken symlinks)
			// This ensures the script continues even if some directories can't be accessed
		}
	}
}

// Print summary of operations performed
console.log(`\nDone. changed=${changed} skipped=${skipped} warnings=${warnings}`);
