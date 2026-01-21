import {z} from "zod";

import {
	emailSchema,
	nameSchema,
	passwordSchema,
	refreshTokenSchema,
} from "./common";

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

export const renewAccessTokenBodySchema = z.object({
	refreshToken: refreshTokenSchema,
});

export const resetPasswordRequestSchema = z.object({
	email: emailSchema,
});

/**
 * Reset password schema factory - OTP length is configurable
 */
export const createResetPasswordBodySchema = (otpLength: number): z.ZodObject<{
	email: typeof emailSchema;
	otp: z.ZodString;
	newPassword: typeof passwordSchema;
}> => {
	return z.object({
		email: emailSchema,
		otp: z.string().length(otpLength, `OTP must be exactly ${otpLength} characters`),
		newPassword: passwordSchema,
	});
};

/**
 * Inferred types from schemas
 */
export type SignupBody = z.infer<typeof signupBodySchema>;
export type SigninBody = z.infer<typeof signinBodySchema>;
export type RenewAccessTokenBody = z.infer<typeof renewAccessTokenBodySchema>;
export type ResetPasswordRequestBody = z.infer<typeof resetPasswordRequestSchema>;
