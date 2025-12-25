import {asTypeIResponseError} from "@customTypes/responseTypes";

export const genericServiceErrors = asTypeIResponseError({
	auth: {
		NoAuthorizationToken: {
			error: "NoAuthorizationToken",
			message: "No authorization token provided",
			details: null,
		},
	},

	errors: {
		ResourceNotFound: {
			error: "ResourceNotFound",
			message: "Resource Not Found",
			details: null,
		},

		ValidationError: {
			error: "ValidationError",
			message: "Validation Error",
			details: null,
		},

		SomethingWentWrong: {
			error: "SomethingWentWrong",
			message: "Something went wrong.",
			details: null,
		},
	},
});
