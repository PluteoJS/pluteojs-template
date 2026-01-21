import {asTypeIResponseError} from "@customTypes/responseTypes";

/**
 * Error messages for API versioning.
 */
export const apiVersioningErrors = asTypeIResponseError({
	errors: {
		// HTTP Status Code: 400
		UnsupportedApiVersion: {
			error: "UNSUPPORTED_API_VERSION",
			message: "The requested API version is not supported.",
			details: null,
		},

		// HTTP Status Code: 400
		MissingApiVersion: {
			error: "MISSING_API_VERSION",
			message: "API version is required in the request path.",
			details: null,
		},

		// HTTP Status Code: 410
		DeprecatedApiVersion: {
			error: "DEPRECATED_API_VERSION",
			message: "The requested API version has been deprecated.",
			details: null,
		},
	},
});
