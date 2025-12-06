import {z} from "zod";
import {emailSchema} from "./common";

/**
 * Schema for requesting email verification.
 */
export const emailVerificationRequestBodySchema = z.object({
	email: emailSchema,
});

export type EmailVerificationRequestBody = z.infer<
	typeof emailVerificationRequestBodySchema
>;
