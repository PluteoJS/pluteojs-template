import {z} from "zod";

import {emailSchema, nameSchema, passwordSchema} from "./common";

/**
 * Auth-related validation schemas.
 */

export const signupBodySchema = z.object({
	name: nameSchema,
	email: emailSchema,
	password: passwordSchema,
	image: z.string().optional(),
	callbackURL: z.string().optional(),
	rememberMe: z.boolean().optional(),
});

export const signinBodySchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	callbackURL: z.string().optional(),
	rememberMe: z.boolean().optional(),
});

export const resetPasswordRequestSchema = z.object({
	email: emailSchema,
});

/**
 * Inferred types from schemas
 */
export type SignupBody = z.infer<typeof signupBodySchema>;
export type SigninBody = z.infer<typeof signinBodySchema>;
export type ResetPasswordRequestBody = z.infer<typeof resetPasswordRequestSchema>;
