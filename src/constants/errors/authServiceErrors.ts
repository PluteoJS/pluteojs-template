import {asTypeIServiceError} from "@customTypes/commonServiceTypes";

const authServiceErrors = asTypeIServiceError({
	signUp: {
		UserAlreadyExists: {
			error: "UserAlreadyExits",

			message: "User already exists",
		},
	},

	signIn: {
		IncorrectUserCredential: {
			error: "IncorrectUserCredential",

			message: "Email or password is incorrect",
		},
	},

	renewAccessToken: {
		InvalidRefreshToken: {
			error: "InvalidRefreshToken",

			message: "Invalid refresh token",
		},
	},

	// Reset Password errors
	resetPassword: {
		otpNotVerified: {
			error: "InvalidOTP",
			message: "Invalid OTP",
		},

		newPasswordMinrequirement: {
			error: "InvalidPassword",
			message: "The password you entered doesn't meet the minimum requirements",
		},

		otpNotIssued: {
			error: "InvalidOTP",
			message: "Invalid OTP",
		},

		otpExpired: {
			error: "ExpiredOTP",
			message: "OTP Expired",
		},

		userNotExist: {
			error: "InvalidOTP",
			message: "Invalid OTP",
		},
	},
});

export {authServiceErrors};
