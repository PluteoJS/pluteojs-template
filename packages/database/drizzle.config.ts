import {defineConfig} from "drizzle-kit";

import config from "@/config/index.js";

/**
 * Drizzle Kit configuration for database migrations and schema management.
 */
export default defineConfig({
	dialect: "postgresql",
	schema: "./src/schema/index.ts",
	out: "./drizzle",
	dbCredentials: {
		url: config.database.url,
	},
	strict: true,
	verbose: true,
});
