import {defineConfig} from "tsup";
import path from "path";

export default defineConfig({
	entry: ["src/index.ts", "src/util/index.ts", "src/auth.cli.ts"],
	format: ["esm"],
	dts: false, // Using tsc for declaration files due to rollup-plugin-dts issues
	clean: true,
	sourcemap: true,
	external: [
		"@pluteojs/database",
		"@pluteojs/email-templates",
		"better-auth",
		"better-auth/plugins",
		"better-auth/plugins/access",
		"better-auth/plugins/organization/access",
		"better-auth/adapters/drizzle",
		"better-auth/node",
		"@react-email/render",
	],
	esbuildOptions(options) {
		options.alias = {
			"@": path.resolve(import.meta.dirname, "src"),
		};
	},
});
