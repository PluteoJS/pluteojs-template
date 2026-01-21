import type {Request, Response as ExpressResponse} from "express";

import type {ExtendedSession, ExtendedUser} from "@pluteojs/better-auth";

import type {iJWTPayload} from "./appDataTypes/authTypes";
import type {iResponseError} from "./responseTypes";

/**
 * Extended Express Request with custom properties.
 */
export interface iRequest<T = unknown> extends Request {
	uniqueRequestId?: string;
	body: T;
	decodedAccessToken?: iJWTPayload;
}

/**
 * Module augmentation for Express to add response envelope helpers.
 */
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		interface Request {
			/**
			 * User session attached by authorization middleware.
			 */
			session?: ExtendedSession;

			/**
			 * Authenticated user attached by authorization middleware.
			 */
			user?: ExtendedUser;
		}

		// eslint-disable-next-line @typescript-eslint/naming-convention
		interface Response {
			/**
			 * Send a success response wrapped in the standard envelope.
			 */
			ok: <T>(data: T, statusCode?: number) => ExpressResponse;

			/**
			 * Send an error response wrapped in the standard envelope.
			 */
			fail: (
				error: iResponseError | string,
				statusCode?: number,
				details?: Record<string, unknown>
			) => ExpressResponse;

			/**
			 * Merge additional metadata into the response meta (pagination, etc.).
			 */
			setResponseMeta: (meta: Record<string, unknown>) => void;
		}

		// eslint-disable-next-line @typescript-eslint/naming-convention
		interface Locals {
			/**
			 * Mutable metadata store merged into the envelope's "meta".
			 */
			responseMeta: Record<string, unknown>;
		}
	}
}
