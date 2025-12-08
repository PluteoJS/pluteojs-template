import dotenv from "dotenv";

// Load env files (local first, then fallbacks to express-api-server)
dotenv.config({path: ".env"});
dotenv.config({path: ".env.local"});
dotenv.config({path: "../../apps/express-api-server/.env.development.local"});
dotenv.config({path: "../../apps/express-api-server/.env.development"});

/**
 * Builds a connection URL from environment variables.
 */
function buildConnectionUrl(): string {
	if (process.env.DATABASE_URL) {
		return process.env.DATABASE_URL;
	}

	const host = process.env.DATABASE_HOST;
	const port = process.env.DATABASE_PORT || "5432";
	const user = process.env.DATABASE_USER;
	const password = process.env.DATABASE_USER_PASSWORD;
	const database = process.env.DATABASE_NAME;

	return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

export default {
	database: {
		host: process.env.DATABASE_HOST,
		port: Number(process.env.DATABASE_PORT || "5432"),
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_USER_PASSWORD,
		name: process.env.DATABASE_NAME,
		url: buildConnectionUrl(),
	},
	nodeEnv: process.env.NODE_ENV || "development",
};
