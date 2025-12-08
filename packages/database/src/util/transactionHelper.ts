import {db} from "../client";

/**
 * Database transaction type - can be used to type transaction parameters in functions
 */
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Transaction callback type
 */
type TransactionCallback<T> = (tx: DbTransaction) => Promise<T>;

/**
 * Executes a callback within a database transaction.
 * Replaces the pg-promise db.tx() pattern.
 *
 * @example
 * ```ts
 * const result = await withTransaction(async (tx) => {
 *   const user = await tx.insert(users).values(userData).returning();
 *   await tx.insert(emailLogs).values({ userId: user[0].id, ... });
 *   return user[0];
 * });
 * ```
 */
export async function withTransaction<T>(
	callback: TransactionCallback<T>
): Promise<T> {
	return db.transaction(callback);
}
