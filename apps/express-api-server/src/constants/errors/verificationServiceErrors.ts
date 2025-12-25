import {asTypeIResponseError} from "@customTypes/responseTypes";

export const verificationServiceErrors = asTypeIResponseError({
	emailVerificationRequest: {
		RetryNotAllowedWithinCoolDownPeriod: {
			error: "RetryNotAllowedWithinCoolDownPeriod",
			message:
				"You're attempting to retry verification before the cool-down period. Please wait for some time before retrying.",
			details: null,
		},
	},

	verifyEmailRequest: {
		NoVerificationRequestFound: {
			error: "NoEmailVerificationRequestFound",
			message: "No verification request found for the given email.",
			details: null,
		},

		OtpExpired: {
			error: "EmailVerificationOtpExpired",
			message: "The OTP has expired.",
			details: null,
		},

		InvalidOtp: {
			error: "InvalidEmailVerificationOtp",
			message: "The OTP you've entered is invalid.",
			details: null,
		},
	},
});
