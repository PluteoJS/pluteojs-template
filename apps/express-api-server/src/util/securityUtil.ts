import {randomUUID} from "crypto";

/**
 * Generates and returns a v4 uuid using the crypto.randomUUID.
 *
 * @returns uuid
 */
function generateUUID(): string {
	const uuid = randomUUID();

	return uuid;
}

export default {
	generateUUID,
};
