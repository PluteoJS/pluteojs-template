import type {httpStatusCodes} from "./networkTypes";
import type {NullableString} from "./commonTypes";

/**
 * Validation error details for a specific segment.
 */
export interface iValidationErrorDetails {
	source: string;
	keys: (string | number)[];
	message: string;
}

/**
 * Map of validation errors by segment.
 */
export type ValidationErrorsType = Record<string, iValidationErrorDetails>;

/**
 * Service error structure.
 */
export interface iServiceError {
	error: string;
	message: string;
	validationErrors?: ValidationErrorsType | null;
}

/**
 * Nullable service error type.
 */
export type NullableServiceError = iServiceError | null;

/**
 * Response metadata.
 */
export interface iResponseMeta {
	URID: NullableString;
}

/**
 * Generic service result structure.
 */
export interface iGenericServiceResult<T> {
	isSuccess: boolean;
	httpStatusCode: httpStatusCodes;
	meta: iResponseMeta;
	error: NullableServiceError;
	data: T;
}

/**
 * Helper function to create typed service errors.
 */
export function asTypeIServiceError<
	T extends Record<string, Record<string, {error: string; message: string}>>,
>(errors: T): T {
	return errors;
}

/**
 * Service success structure.
 */
export interface iServiceSuccess {
	message: string;
}

/**
 * Nullable service success type.
 */
export type NullableServiceSuccess = iServiceSuccess | null;
