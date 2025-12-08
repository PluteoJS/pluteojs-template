import {z} from "zod";

/**
 * Environment schema for database configuration.
 * Supports both DATABASE_URL (connection string) and individual POSTGRES_* params.
 */
export const databaseEnvSchema = z
	.object({
		// Option 1: Full connection URL
		DATABASE_URL: z.string().url().optional(),

		// Option 2: Individual parameters
		DATABASE_HOST: z.string().optional(),
		DATABASE_PORT: z.coerce.number().default(5432),
		DATABASE_USER: z.string().optional(),
		DATABASE_USER_PASSWORD: z.string().optional(),
		DATABASE_NAME: z.string().optional(),

		// Environment indicator for mock data guards
		NODE_ENV: z
			.enum(["development", "development.local", "test", "staging", "production"])
			.default("development"),
	})
	.refine(
		(data) => {
			// Either DATABASE_URL or all individual params must be provided
			const hasUrl = !!data.DATABASE_URL;
			const hasIndividualParams =
				!!data.DATABASE_HOST &&
				!!data.DATABASE_USER &&
				!!data.DATABASE_USER_PASSWORD &&
				!!data.DATABASE_NAME;
			return hasUrl || hasIndividualParams;
		},
		{
			message:
				"Either DATABASE_URL or all individual database parameters (DATABASE_HOST, DATABASE_USER, DATABASE_USER_PASSWORD, DATABASE_NAME) must be provided",
		}
	);

export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;
