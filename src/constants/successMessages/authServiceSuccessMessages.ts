import {asTypeIServiceSuccess} from "@customTypes/commonServiceTypes";

const authServiceSuccessMessage = asTypeIServiceSuccess({
	passwordReset: {
		passwordResetSuccess: {
			message: "Password reset successfully",
		},
	},
});

export {authServiceSuccessMessage};
