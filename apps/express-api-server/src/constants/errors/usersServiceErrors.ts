import {asTypeIServiceError} from "@customTypes/serviceTypes";

export const usersServiceError = asTypeIServiceError({
	getUserDetails: {
		UserDoesNotExists: {
			error: "UserDoesNotExists",

			message: "User doesn't exists",
		},
	},
});
