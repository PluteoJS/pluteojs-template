/**
 * @pluteojs/database
 *
 * Drizzle ORM database package for the PluteoJS monorepo.
 */

// Re-export common Drizzle query operators for convenience
export {
	eq,
	ne,
	gt,
	gte,
	lt,
	lte,
	isNull,
	isNotNull,
	inArray,
	notInArray,
	exists,
	notExists,
	between,
	notBetween,
	like,
	ilike,
	notLike,
	notIlike,
	and,
	or,
	not,
	asc,
	desc,
	sql,
	count,
	sum,
	avg,
	min,
	max,
} from "drizzle-orm";

// Database client
export {db, pool, type Database} from "@/client";

// Schema exports
export * from "@/schema";

// Config (default export - use `import config from "@pluteojs/database/config"` if needed)
export {default as config} from "@/config";

// Constants
export {serverModes, databaseSslModes} from "@/constants/databaseConstants";

// Type exports
export {type DBTransaction} from "@/types";
