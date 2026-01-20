import {z} from "zod";

/**
 * Transforms a string environment variable to an integer.
 */
const stringToInt = z.string().transform((val) => parseInt(val, 10));

/**
 * Transforms a string to a boolean ("true" -> true, anything else -> false).
 */
const stringToBool = z
	.string()
	.transform((val) => val.toLowerCase() === "true");

/**
 * Validates that the parsed port number is within valid TCP port range.
 */
const validPortNumber = stringToInt.pipe(z.number().min(1).max(65535));

/**
 * Validates that a pool size is a non-negative integer.
 */
const poolSizeValidator = stringToInt.pipe(z.number().min(0));

/**
 * Validates that timeout is at least 1 second (1000ms).
 */
const timeoutValidator = stringToInt.pipe(z.number().min(1000));

/**
 * Schema for validating PostgreSQL database environment variables.
 *
 * Supports two connection modes:
 * 1. Direct connection URL via DATABASE_URL
 * 2. Individual connection parameters (host, port, user, password, database name)
 *
 * At least one of these modes must be fully configured.
 */
export const databaseEnvSchema = z
	.object({
		NODE_ENV: z
			.enum([
				"development.local",
				"development",
				"test",
				"staging",
				"production",
			])
			.default("development.local"),

		DATABASE_URL: z
			.string()
			.url("Invalid PostgreSQL connection URL format")
			.optional(),

		DATABASE_HOST: z.string().optional(),
		DATABASE_PORT: validPortNumber.optional(),
		DATABASE_USER: z.string().optional(),
		DATABASE_USER_PASSWORD: z.string().optional(),
		DATABASE_NAME: z.string().optional(),

		DB_POOL_MIN: poolSizeValidator.default(2),
		DB_POOL_MAX: poolSizeValidator.pipe(z.number().min(1)).default(10),
		DB_POOL_IDLE_TIMEOUT: timeoutValidator.default(30000),

		DB_SSL: stringToBool.default(false),
	})
	.refine(
		(env) => {
			const hasConnectionUrl = Boolean(env.DATABASE_URL);
			const hasAllConnectionParams =
				Boolean(env.DATABASE_HOST) &&
				Boolean(env.DATABASE_USER) &&
				Boolean(env.DATABASE_USER_PASSWORD) &&
				Boolean(env.DATABASE_NAME);

			return hasConnectionUrl || hasAllConnectionParams;
		},
		{
			message:
				"Database connection requires either DATABASE_URL or complete connection parameters (DATABASE_HOST, DATABASE_USER, DATABASE_USER_PASSWORD, DATABASE_NAME)",
		}
	);

/**
 * Inferred type from the database environment schema after validation.
 */
export type DatabaseEnvConfig = z.infer<typeof databaseEnvSchema>;
