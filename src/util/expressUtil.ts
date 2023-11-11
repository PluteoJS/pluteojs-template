import {NullableString} from "@customTypes/commonTypes";
import {iRequest} from "@customTypes/expressTypes";
import logger from "@loaders/logger";

/**
 * Returns the client IP address.
 *
 * @param req - Express request object
 * @returns - Client IP address
 */
function getClientIp<T>(req: iRequest<T>): NullableString {
	let clientIp: NullableString = null;

	const ipReverseFromProxy = req.headers["x-forwarded-for"];
	if (ipReverseFromProxy) {
		clientIp = ipReverseFromProxy as string;
	} else {
		clientIp = req.socket.remoteAddress || null;
	}

	return clientIp;
}

/**
 * Parses the unique request ID from the request object.
 * This won't throw an error if the unique request ID is not present.
 * The exception is caught and logged.
 *
 * @param req - Express request object.
 * @returns - The unique request ID.
 */
function parseUniqueRequestId<T>(req: iRequest<T>): NullableString {
	let uniqueRequestId = null;

	try {
		uniqueRequestId = req.uniqueRequestId;
	} catch (error) {
		logger.error(
			null,
			"Error while parsing unique request ID from request object",
			error
		);
	}

	return uniqueRequestId;
}

export default {
	getClientIp,
	parseUniqueRequestId,
};
