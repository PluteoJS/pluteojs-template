import {asTypeIResponseError} from "@customTypes/responseTypes";

export const authServiceErrors = asTypeIResponseError({
	signUp: {
		UserAlreadyExists: {
			error: "UserAlreadyExits",
			message: "User already exists",
			details: null,
		},
	},

	signIn: {
		IncorrectUserCredential: {
			error: "IncorrectUserCredential",
			message: "Email or password is incorrect",
			details: null,
		},
	},

	renewAccessToken: {
		InvalidRefreshToken: {
			error: "InvalidRefreshToken",
			message: "Invalid refresh token",
			details: null,
		},
	},

	// Reset Password errors
	resetPassword: {
		otpNotVerified: {
			error: "InvalidOTP",
			message: "Invalid OTP",
			details: null,
		},

		newPasswordMinrequirement: {
			error: "InvalidPassword",
			message: "The password you entered doesn't meet the minimum requirements",
			details: null,
		},

		otpNotIssued: {
			error: "InvalidOTP",
			message: "Invalid OTP",
			details: null,
		},

		otpExpired: {
			error: "ExpiredOTP",
			message: "OTP Expired",
			details: null,
		},

		userNotExist: {
			error: "InvalidOTP",
			message: "Invalid OTP",
			details: null,
		},
	},
});
