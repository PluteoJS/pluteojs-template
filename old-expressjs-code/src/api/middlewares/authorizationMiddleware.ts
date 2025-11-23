import {expressjwt} from "express-jwt";

import config from "@config";
import httpHeaderUti from "@util/httpHeaderUtil";

const {algorithm, secretKey} = config.jwtConfig;

/**
 * Checks if the request is authorized or not.
 */
const isAuthorized = expressjwt({
	algorithms: [algorithm],
	secret: secretKey,
	requestProperty: "decodedAccessToken",
	getToken: httpHeaderUti.getAuthorizationTokenFromHeader,
});

export {isAuthorized};
