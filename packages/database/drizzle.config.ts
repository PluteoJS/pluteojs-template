import {config} from "dotenv";
import {defineConfig} from "drizzle-kit";

// Load .env file from database package or fallback to express-api-server
config({path: ".env"});
config({path: ".env.local"});
config({path: "../../apps/express-api-server/.env.development.local"});
config({path: "../../apps/express-api-server/.env.development"});

/**
 * Build connection URL from individual params or use DATABASE_URL directly.
 */
function getConnectionUrl(): string {
	if (process.env.DATABASE_URL) {
		return process.env.DATABASE_URL;
	}

	const host = process.env.DATABASE_HOST;
	const port = process.env.DATABASE_PORT || "5432";
	const user = process.env.DATABASE_USER;
	const password = process.env.DATABASE_USER_PASSWORD;
	const database = process.env.DATABASE_NAME;

	if (host && user && password && database) {
		return `postgresql://${user}:${password}@${host}:${port}/${database}`;
	}

	throw new Error(
		"Database configuration missing. Provide DATABASE_URL or all of: DATABASE_HOST, DATABASE_USER, DATABASE_USER_PASSWORD, DATABASE_NAME"
	);
}

export default defineConfig({
	schema: "./src/schema/index.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: getConnectionUrl(),
	},
});
