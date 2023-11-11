import {nanoid} from "nanoid";
import config from "@config";

async function generateOTP(
	otpCharLength: number = config.resetPasswordConfig.otpLength
): Promise<string> {
	const generatedOTP = nanoid(otpCharLength);
	return generatedOTP;
}

export default {
	generateOTP,
};
