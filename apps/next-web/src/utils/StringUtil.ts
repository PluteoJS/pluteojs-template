import {UndefinableString} from "@/customTypes/CommonTypes";

/**
 * Trims a string of leading and trailing spaces and conditionally adds prefix and postfix strings.
 *
 * The `safeTrim` function ensures that no errors occur if the input string is `null` or `undefined`.
 * If the input is either, the function returns an empty string. If a non-null string is provided,
 * the function will trim leading and trailing spaces and optionally add provided prefix and/or postfix
 * strings to the trimmed string.
 *
 * @param {string | null | undefined} input - The string to trim. This parameter accepts `null` or `undefined` values.
 * @param {string | undefined} [prefix] - Optional prefix to add before the trimmed input string. If this argument is `undefined` or not provided, no prefix is added.
 * @param {string | undefined} [postfix] - Optional postfix to add after the trimmed input string. If this argument is `undefined` or not provided, no postfix is added.
 *
 * @returns {string} - The processed string. If the original input was `null` or `undefined`, it returns an empty string.
 * Otherwise, it returns the input string trimmed of leading and trailing spaces and conditionally concatenated with
 * the provided prefix and/or postfix. If no prefix or postfix was provided, it returns the trimmed string.
 *
 * @example
 *
 *   safeTrim("  sample text  "); // Returns: "sample text"
 *   safeTrim("  sample text  ", "PRE-"); // Returns: "PRE-sample text"
 *   safeTrim("  sample text  ", "PRE-", "-POST"); // Returns: "PRE-sample text-POST"
 *   safeTrim(null); // Returns: ""
 *   safeTrim(undefined); // Returns: ""
 *
 */
function safeTrim(
	input: string | null | undefined,
	prefix?: UndefinableString,
	postfix?: UndefinableString
): string {
	// If the input is null or undefined, return an empty string
	if (!input) {
		return "";
	}

	let trimmedString = input.trim();
	if (prefix) {
		trimmedString = `${prefix}${trimmedString}`;
	}

	if (postfix) {
		trimmedString = `${trimmedString}${postfix}`;
	}

	return trimmedString;
}

const StringUtil = {
	safeTrim,
};

export default StringUtil;
