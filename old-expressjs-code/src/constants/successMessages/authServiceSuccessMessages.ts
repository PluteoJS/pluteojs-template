import {asTypeIServiceSuccess} from "@pluteojs/types/modules/commonServiceTypes";

const authServiceSuccessMessage = asTypeIServiceSuccess({
	passwordReset: {
		passwordResetSuccess: {
			message: "Password reset successfully",
		},
	},
});

export {authServiceSuccessMessage};
