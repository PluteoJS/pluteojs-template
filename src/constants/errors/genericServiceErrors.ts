import {asTypeIServiceError} from "@customTypes/commonServiceTypes";

const genericServiceErrors = asTypeIServiceError({
	auth: {
		NoAuthorizationToken: {
			error: "NoAuthorizationToken",
			message: "No authorization token provided",
		},
	},

	errors: {
		ResourceNotFound: {
			error: "ResourceNotFound",

			message: "Resource Not Found",
		},

		ValidationError: {
			error: "ValidationError",

			message: "Validation Error",
		},

		SomethingWentWrong: {
			error: "SomethingWentWrong",
			message: "Something went wrong.",
		},
	},
});

export {genericServiceErrors};
