import {v4 as uuidv4} from "uuid";

/**
 * Generates and returns a v4 uuid using uuidv4 from uuid package.
 *
 * @returns uuid
 */
function generateUUID(): string {
	const uuid = uuidv4();

	return uuid;
}

const SecurityUtil = {
	generateUUID,
};

export default SecurityUtil;
