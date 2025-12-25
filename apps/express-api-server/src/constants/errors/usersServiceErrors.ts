import {asTypeIResponseError} from "@customTypes/responseTypes";

export const usersServiceError = asTypeIResponseError({
	getUserDetails: {
		UserDoesNotExists: {
			error: "UserDoesNotExists",
			message: "User doesn't exists",
			details: null,
		},
	},
});
