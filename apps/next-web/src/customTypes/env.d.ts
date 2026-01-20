/**
 * FIXME: This interface currently has no environment variable definitions.
 * The eslint-disable below suppresses the "no-empty-object-type" warning because this
 * interface is intentionally kept as a placeholder for type-safe environment variables.
 *
 * When you add environment variables (e.g., NEXT_PUBLIC_API_URL, DATABASE_URL):
 * 1. Add your environment variable types to this interface
 * 2. Remove the eslint-disable comment below - it will no longer be needed
 *
 * Example:
 *   interface ProcessEnv {
 *     NEXT_PUBLIC_API_URL: string;
 *     DATABASE_URL: string;
 *   }
 */
declare namespace NodeJS {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface ProcessEnv {}
}
