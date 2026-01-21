import {z} from "zod";

/**
 * Common validation schemas shared across the application.
 */

export const uuidv4Schema = z.string().uuid();

export const emailSchema = z.string().email();

export const nameSchema = z.string().min(1, "Name is required");

export const firstNameSchema = z.string().min(1, "First name is required");

export const lastNameSchema = z.string().min(1, "Last name is required");

export const passwordSchema = z.string().min(1, "Password is required");

/**
 * Inferred types from schemas
 */
export type Email = z.infer<typeof emailSchema>;
export type Name = z.infer<typeof nameSchema>;
export type FirstName = z.infer<typeof firstNameSchema>;
export type LastName = z.infer<typeof lastNameSchema>;
export type Password = z.infer<typeof passwordSchema>;
