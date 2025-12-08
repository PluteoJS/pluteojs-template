import {db} from "@/client";

/**
 * Database transaction type for typing transaction callback parameters.
 *
 * @example
 * ```ts
 * async function createUserWithProfile(tx: DBTransaction) {
 *   const user = await tx.insert(users).values(userData).returning();
 *   await tx.insert(profiles).values({ userId: user[0].id });
 *   return user[0];
 * }
 *
 * await db.transaction(createUserWithProfile);
 * ```
 */
export type DBTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
