import {z} from "zod";

import {uuidv4Schema, emailSchema, firstNameSchema, lastNameSchema} from "./common.js";

/**
 * User-related validation schemas.
 */

export const userIdSchema = uuidv4Schema;

export const userSchema = z.object({
	id: userIdSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	email: emailSchema,
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const userResponseSchema = userSchema.omit({createdAt: true, updatedAt: true});

/**
 * Inferred types from schemas
 */
export type UserId = z.infer<typeof userIdSchema>;
export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
