/**
 * NOTE: Please don't import "@config" to this file as it will cause
 * circular dependency.
 */
import type {StringValue} from "ms";
import ms from "ms";

import {serverModes} from "@constants/serverConstants";
import type {NullableString} from "@pluteojs/types/modules/commonTypes";

/**
 * Returns the appropriate envFilePath depending on the value of
 * process.env.NODE_ENV.
 *
 * By default it will return "./.env.development"
 *
 * @returns envFilePath
 */
const getEnvFilePath = (): string => {
	let enfFilePath: NullableString = null;

	switch (process.env.NODE_ENV) {
		case serverModes.PRODUCTION:
			enfFilePath = "./.env.production";

			break;

		case serverModes.STAGING:
			enfFilePath = "./.env.staging";
			break;

		case serverModes.DEVELOPMENT:
			enfFilePath = "./.env.development";
			break;

		default: {
			enfFilePath = "./.env.development.local";
		}
	}

	return enfFilePath;
};

/**
 * Converts a human-readable duration string into milliseconds with strict validation.
 *
 * @param value - A duration string to parse (e.g., '1h', '30m', '2d').
 * @param options - Optional configuration for minimum and maximum duration bounds.
 * @returns The duration in milliseconds.
 * @throws Will throw an error if the input is invalid or violates the specified bounds.
 */
export function convertDurationToMs(
	value: string,
	options: {
		/**
		 * Minimum allowed duration in milliseconds.
		 * If specified, the parsed duration must be equal to or greater than this value.
		 */
		min?: number;

		/**
		 * Maximum allowed duration in milliseconds.
		 * If specified, the parsed duration must be equal to or less than this value.
		 */
		max?: number;
	} = {}
): number {
	/**
	 * Trim the input value to remove any leading or trailing whitespace.
	 * This is important for ensuring that the input is clean and doesn't contain
	 * any unnecessary spaces that could affect parsing.
	 */
	const trimmedValue = value.trim();

	/**
	 * Check if the trimmed value is empty.
	 * If it is, throw an error indicating that the duration string is empty.
	 */
	if (!trimmedValue) {
		throw new Error("Duration string is empty.");
	}

	/**
	 * Check if the trimmed value is too long.
	 * If it exceeds the maximum length (100 characters), throw an error.
	 * This is important to prevent excessively long strings that could
	 * lead to performance issues or unexpected behavior.
	 */
	const MAX_LENGTH = 100;
	if (trimmedValue.length > MAX_LENGTH) {
		throw new Error(
			`Duration string exceeds maximum length of ${MAX_LENGTH} characters.`
		);
	}

	/**
	 * Check if the trimmed value starts with a negative sign.
	 * If it does, throw an error indicating that negative durations are not allowed.
	 * This is important to ensure that the duration is always a positive value.
	 */
	if (trimmedValue.startsWith("-")) {
		throw new Error("Negative durations are not allowed.");
	}

	/**
	 * Parse the trimmed value using the ms library.
	 * The ms function converts a human-readable duration string into milliseconds.
	 * If the parsed value is not a number or is not finite, throw an error.
	 */
	const duration = ms(trimmedValue as StringValue);

	if (typeof duration !== "number" || !Number.isFinite(duration)) {
		throw new Error(`Invalid duration string: "${value}"`);
	}

	const {min, max} = options;

	if (typeof min === "number" && duration < min) {
		throw new Error(`Duration must be at least ${min} milliseconds.`);
	}

	if (typeof max === "number" && duration > max) {
		throw new Error(`Duration must not exceed ${max} milliseconds.`);
	}

	return duration;
}

export default {
	getEnvFilePath,
	convertDurationToMs,
};
