import {asTypeIResponseError} from "@customTypes/responseTypes";

/**
 * Error messages for authentication route operations if better-auth handler fails
 * to return the appropriate error response.
 */
export const authRouteErrors = asTypeIResponseError({
	errors: {
		// HTTP Status Code: 400
		BadRequest: {
			error: "BAD_REQUEST",
			message: "The request could not be understood or was missing required parameters.",
			details: null,
		},

		// HTTP Status Code: 401
		Unauthorized: {
			error: "UNAUTHORIZED",
			message: "Authentication is required and has failed or has not yet been provided.",
			details: null,
		},

		// HTTP Status Code: 403
		Forbidden: {
			error: "FORBIDDEN",
			message: "You do not have permission to access this resource.",
			details: null,
		},

		// HTTP Status Code: 404
		NotFound: {
			error: "NOT_FOUND",
			message: "The requested resource could not be found.",
			details: null,
		},

		// HTTP Status Code: 422
		UnprocessableEntity: {
			error: "UNPROCESSABLE_ENTITY",
			message: "The request was well-formed but was unable to be followed due to semantic errors.",
			details: null,
		},

		// HTTP Status Code: 429
		TooManyRequests: {
			error: "TOO_MANY_REQUESTS",
			message: "Too many requests have been made in a short period. Please try again later.",
			details: null,
		},

		// HTTP Status Code: 500
		InternalServerError: {
			error: "INTERNAL_SERVER_ERROR",
			message: "An unexpected error occurred on the server.",
			details: null,
		},

		// Any other authentication error
		AuthError: {
			error: "AUTH_ERROR",
			message: "Authentication error occurred",
			details: null,
		},

		// Better-auth handler error
		AuthHandlerError: {
			error: "AUTH_HANDLER_ERROR",
			message: "An error occurred while processing authentication request",
			details: null,
		},
	},
});
