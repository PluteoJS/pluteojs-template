import {defineConfig} from "drizzle-kit";

import config from "./src/config";

export default defineConfig({
	schema: "./src/schema/index.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: config.database.url,
	},
});
