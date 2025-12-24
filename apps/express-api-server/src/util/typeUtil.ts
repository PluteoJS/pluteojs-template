/**
 * NOTE: Please don't import "@config" to this file as it will cause
 * circular dependency.
 */
import type {StringValue} from "ms";
import ms from "ms";

/**
 * Parses a string value into a boolean.
 *
 * Only the string value "true" (case-insensitive) and "1" are considered as true.
 * All other values are considered as false.
 *
 * @param str - The string value to parse.
 * @returns The parsed boolean value.
 */
export function parseBooleanFromString(str: string | undefined | null): boolean {
	if (str === undefined || str === null) {
		return false;
	}

	if (str.length === 0) {
		return false;
	}

	if (str.toLowerCase() === "true") {
		return true;
	}

	if (str === "1") {
		return true;
	}

	return false;
}

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
	 */
	const trimmedValue = value.trim();

	/**
	 * Check if the trimmed value is empty.
	 */
	if (!trimmedValue) {
		throw new Error("Duration string is empty.");
	}

	/**
	 * Check if the trimmed value is too long.
	 */
	const MAX_LENGTH = 100;
	if (trimmedValue.length > MAX_LENGTH) {
		throw new Error(
			`Duration string exceeds maximum length of ${MAX_LENGTH} characters.`
		);
	}

	/**
	 * Check if the trimmed value starts with a negative sign.
	 */
	if (trimmedValue.startsWith("-")) {
		throw new Error("Negative durations are not allowed.");
	}

	/**
	 * Parse the trimmed value using the ms library.
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
	parseBooleanFromString,
	convertDurationToMs,
};
