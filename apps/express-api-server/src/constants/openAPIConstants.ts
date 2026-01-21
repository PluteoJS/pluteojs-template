import {z} from "zod";

/**
 * OpenAPI response envelope schemas.
 * These match the API response format used by expressUtil.
 */

/**
 * Error details schema for API errors.
 */
export const ErrorSchema = z.object({
	code: z.string().openapi({description: "Machine-readable error code"}),
	message: z.string().openapi({description: "Human-readable error message"}),
	details: z.record(z.string(), z.unknown()).nullable().optional().openapi({
		description: "Additional error details",
	}),
});

/**
 * Metadata schema included in all responses.
 */
export const MetaSchema = z.object({
	URID: z.string().optional().openapi({description: "Unique Request ID"}),
}).catchall(z.unknown());

/**
 * Creates a success response envelope schema wrapping the provided data schema.
 *
 * @param data - The Zod schema for the response data
 * @returns A Zod schema for the success envelope
 */
export const SuccessEnvelope = <T extends z.ZodTypeAny>(data: T): z.ZodObject<{
	isSuccess: z.ZodLiteral<true>;
	httpStatusCode: z.ZodNumber;
	meta: typeof MetaSchema;
	error: z.ZodNull;
	data: T;
}> => {
	return z.object({
		isSuccess: z.literal(true),
		httpStatusCode: z.number().openapi({description: "HTTP status code", example: 200}),
		meta: MetaSchema,
		error: z.null(),
		data,
	});
};

/**
 * Error response envelope schema.
 */
export const ErrorEnvelope = z.object({
	isSuccess: z.literal(false),
	httpStatusCode: z.number().openapi({description: "HTTP status code", example: 400}),
	meta: MetaSchema,
	error: ErrorSchema,
	data: z.unknown().nullable(),
});
