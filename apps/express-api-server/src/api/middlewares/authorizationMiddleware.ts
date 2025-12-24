import {expressjwt} from "express-jwt";

import config from "@config";
import httpHeaderUtil from "@util/httpHeaderUtil";

const {algorithm, secretKey} = config.jwtConfig;

/**
 * Authorization middleware using express-jwt.
 * This middleware verifies the JWT token from the Authorization header.
 */
export const isAuthorized = expressjwt({
	algorithms: [algorithm],
	secret: secretKey,
	requestProperty: "decodedAccessToken",
	getToken: httpHeaderUtil.getAuthorizationTokenFromHeader,
});
