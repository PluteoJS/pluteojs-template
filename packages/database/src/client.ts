import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";

import config from "./config";
import * as schema from "./schema";

// Create connection pool
const pool = new Pool({
	connectionString: config.database.url,
	max: 10, // Maximum number of connections
});

// Create Drizzle instance with schema for relational queries
export const db = drizzle(pool, {schema});

// Export pool for direct access if needed (e.g., for graceful shutdown)
export {pool};

// Export types
export type Database = typeof db;
