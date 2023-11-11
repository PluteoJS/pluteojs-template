import {asTypeIServiceError} from "@customTypes/commonServiceTypes";

const verificationServiceErrors = asTypeIServiceError({
	emailVerificationRequest: {
		RetryNotAllowedWithinCoolDownPeriod: {
			error: "RetryNotAllowedWithinCoolDownPeriod",

			message:
				"You're attempting to retry verification before the cool-down period. Please wait for some time before retrying.",
		},
	},

	verifyEmailRequest: {
		NoVerificationRequestFound: {
			error: "NoEmailVerificationRequestFound",
			message: "No verification request found for the given email.",
		},

		OtpExpired: {
			error: "EmailVerificationOtpExpired",
			message: "The OTP has expired.",
		},

		InvalidOtp: {
			error: "InvalidEmailVerificationOtp",
			message: "The OTP you've entered is invalid.",
		},
	},
});

export {verificationServiceErrors};
