import {customAlphabet} from "nanoid";
import config from "@config";

/**
 * Generates an OTP for email verification
 *
 * @param otpCharLength - length of the OTP to be generated.
 * The default value is taken from the config file.
 * @returns string generated OTP
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
