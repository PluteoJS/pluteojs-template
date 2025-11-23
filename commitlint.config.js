const { getPackagesSync } = require("@manypkg/get-packages");

/**
 * Returns an array of package names in the workspace.
 *
 * @function
 * @returns {string[]} List of workspace package names.
 */
function workspaceScopes() {
	const { packages } = getPackagesSync(process.cwd());

	const workspaces = packages.map((pkg) => {
		const packageName = pkg.packageJson.name;

		return packageName;
	});

	return workspaces;
}

/**
 * An array of additional scopes to include alongside workspace package names
 * for commitlint scope validation.
 *
 * Add custom scopes to this array if they should be allowed in commit messages,
 * for cases not covered by workspace packages.
 *
 * @type {string[]}
 */
const extraScopes = [
	"api",
	"api-service",
	"build",
	"claude",
	"cleanup",
	"commitlint",
	"create-turbo",
	"cursor",
	"editorconfig",
	"eslint",
	"hono",
	"husky",
	"mcp",
	"root",
	"tsconfig",
	"turbo",
	"vscode",
];

/**
 * @module commitlint-config
 * @description
 * Commitlint configuration object.
 *
 * This configuration extends the conventional config and enforces valid commit scopes
 * that include both workspace package names (determined dynamically) and a list of custom
 * extra scopes. The set of allowed scopes is built from combining the results of
 * {@link workspaceScopes} and the {@link extraScopes} array (ensuring no duplicates).
 * 
 * NOTE: Do not register the workspace-scopes plugin, as all scopes are managed here
 * to avoid duplication. The getPackagesSync function is still required.
 *
 * @see https://commitlint.js.org/
 * @type {import('@commitlint/types').UserConfig}
 */
module.exports = {
	/**
	 * Extends the default conventional commitlint configuration.
	 * @type {string[]}
	 */
	extends: ["@commitlint/config-conventional"],

	/**
	 * Commitlint rules for validating commit messages.
	 * - 'scope-enum': requires scopes to be one of the calculated set.
	 * @type {Object}
	 */
	rules: {
		/**
		 * Enforces that commit scopes are in the allowed list.
		 * @see workspaceScopes
		 * @see extraScopes
		 */
		"scope-enum": [2, "always", [...new Set([...workspaceScopes(), ...extraScopes])]],
	},

	/**
	 * Parser preset configuration.
	 * This uses standard parsing options; no custom parser required.
	 * @type {Object}
	 */
	parserPreset: {
		parserOpts: {
			// Standard parser options; plugin provides valid commit scopes.
		},
	},

	// The getPackagesSync plugin must remain installed, as it's used above to find workspace scopes.
};
