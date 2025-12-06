import {customAlphabet} from "nanoid";
import config from "@config";

/**
 * Generates an OTP for email verification.
 */
async function generateEmailVerificationOTP(
	otpCharLength: number = config.verificationConfig.emailVerificationOtpLength
): Promise<string> {
	const alphabet = config.verificationConfig.emailVerificationOtpCustomAlphabet;
	const nanoid = customAlphabet(alphabet);

	const generatedOTP = nanoid(otpCharLength);

	return generatedOTP;
}

export default {
	generateEmailVerificationOTP,
};
