import type {Request} from "express";

import type {iJWTPayload} from "./appDataTypes/authTypes";

/**
 * Extended Express Request with custom properties.
 */
export interface iRequest<T = unknown> extends Request {
	uniqueRequestId?: string;
	body: T;
	decodedAccessToken?: iJWTPayload;
}
