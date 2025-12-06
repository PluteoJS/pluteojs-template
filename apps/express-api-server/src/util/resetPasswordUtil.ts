import {customAlphabet} from "nanoid";
import config from "@config";

async function generateOTP(
	otpCharLength: number = config.resetPasswordConfig.otpLength
): Promise<string> {
	const alphabet = config.resetPasswordConfig.otpCustomAlphabet || "0123456789";
	const nanoid = customAlphabet(alphabet);

	const generatedOTP = nanoid(otpCharLength);
	return generatedOTP;
}

export default {
	generateOTP,
};
