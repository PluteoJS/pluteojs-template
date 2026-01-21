import type {Request, Response, NextFunction} from "express";

import config from "@config";
import {httpStatusCodes} from "@customTypes/networkTypes";
import {apiVersioningErrors} from "@constants/errors/apiVersioningErrors";

/**
 * Extended Request interface with API version.
 */
export interface VersionedRequest extends Request {
	apiVersion?: string;
}

/**
 * Extracts the API version from the URL path.
 *
 * Expects paths in the format: /v1/..., /v2/..., etc.
 *
 * @param path - The request path (after API prefix)
 * @returns The version string (e.g., "v1") or null if not found
 */
const extractVersionFromPath = (path: string): string | null => {
	const versionMatch = path.match(/^\/(v\d+)/);
	return versionMatch?.[1] ?? null;
};

/**
 * API Versioning Middleware.
 *
 * This middleware:
 * - Extracts the API version from the URL path (e.g., "v1" from "/v1/users")
 * - Validates against supported versions in config
 * - Returns 400 error for unsupported versions
 * - Stores the version in req.apiVersion for downstream use
 * - Sets API-Version response header
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const apiVersioningMiddleware = (
	req: VersionedRequest,
	res: Response,
	next: NextFunction
): void => {
	const version = extractVersionFromPath(req.path);
	const {supported, deprecated} = config.api.versions;

	// Check if version is present
	if (!version) {
		res.fail(
			apiVersioningErrors.errors.MissingApiVersion,
			httpStatusCodes.CLIENT_ERROR_BAD_REQUEST
		);
		return;
	}

	// Check if version is supported
	if (!supported.includes(version)) {
		// Check if it's a deprecated version (use 400 as 410 GONE is not in the enum)
		if (deprecated.includes(version)) {
			res.fail(
				apiVersioningErrors.errors.DeprecatedApiVersion,
				httpStatusCodes.CLIENT_ERROR_BAD_REQUEST
			);
			return;
		}

		res.fail(
			apiVersioningErrors.errors.UnsupportedApiVersion,
			httpStatusCodes.CLIENT_ERROR_BAD_REQUEST
		);
		return;
	}

	// Store version in request for downstream use
	req.apiVersion = version;

	// Set API-Version response header
	res.setHeader("API-Version", version);

	next();
};
