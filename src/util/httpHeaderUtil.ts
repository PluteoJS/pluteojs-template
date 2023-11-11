import {TokenGetter} from "express-jwt";

/**
 * Retrieves the Bearer JWT from the request authorization header.
 *
 * @param req
 * @returns accessToken
 */
const getAuthorizationTokenFromHeader: TokenGetter = (req) => {
	const {authorization} = req.headers;

	if (authorization) {
		const [, accessToken] = authorization.split(" ");

		return accessToken;
	}

	return undefined;
};

export default {
	getAuthorizationTokenFromHeader,
};
