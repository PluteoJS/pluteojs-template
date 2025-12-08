import {defineConfig} from "tsup";
import path from "path";

export default defineConfig({
	entry: ["src/index.ts", "src/schema/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	esbuildOptions(options) {
		options.alias = {
			"@": path.resolve(import.meta.dirname, "src"),
		};
	},
});
