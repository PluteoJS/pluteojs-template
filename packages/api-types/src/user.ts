import {z} from "zod";

import {uuidv4Schema, emailSchema, nameSchema} from "./common.js";

/**
 * User-related validation schemas.
 */

export const userIdSchema = uuidv4Schema;

export const userSchema = z.object({
	id: userIdSchema,
	name: nameSchema,
	email: emailSchema,
	emailVerified: z.boolean(),
	image: z.string().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const userResponseSchema = userSchema;

/**
 * Inferred types from schemas
 */
export type UserId = z.infer<typeof userIdSchema>;
export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
