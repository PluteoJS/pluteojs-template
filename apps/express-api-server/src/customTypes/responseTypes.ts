import type {httpStatusCodes} from "./networkTypes";

/**
 * Error object structure for API responses.
 */
export interface iResponseError {
	error: string;
	message: string;
	details: Record<string, unknown> | null;
}

/**
 * Pagination details for paginated API responses.
 */
export interface iPaginationDetails {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

/**
 * Response metadata structure.
 */
export interface iResponseMeta {
	URID: string;
	pagination: iPaginationDetails | null;
	[key: string]: unknown;
}

/**
 * Generic API response envelope structure.
 */
export interface iGenericAPIResponse<T> {
	isSuccess: boolean;
	httpStatusCode: httpStatusCodes;
	meta: iResponseMeta;
	error: iResponseError | null;
	data: T;
}

/**
 * Helper function to create typed response errors.
 */
export function asTypeIResponseError<
	T extends Record<string, Record<string, {error: string; message: string; details: null}>>,
>(errors: T): T {
	return errors;
}
