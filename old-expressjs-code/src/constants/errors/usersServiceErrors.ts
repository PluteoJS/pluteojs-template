import {asTypeIServiceError} from "@pluteojs/types/modules/commonServiceTypes";

const usersServiceError = asTypeIServiceError({
	getUserDetails: {
		UserDoesNotExists: {
			error: "UserDoesNotExists",

			message: "User doesn't exists",
		},
	},
});

export {usersServiceError};
