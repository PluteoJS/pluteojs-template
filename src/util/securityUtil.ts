import {randomUUID} from "crypto";

import * as jwt from "jsonwebtoken";

import logger from "@loaders/logger";

import config from "@config";

import {iJWTPayload, iTokenPair} from "@customTypes/appDataTypes/authTypes";
import {NullableString} from "@customTypes/commonTypes";

/**
 * Generates and returns a v4 uuid using the crypto.randomUUID.
 *
 * @returns uuid
 */
function generateUUID(): string {
	const uuid = randomUUID();

	return uuid;
}

/**
 * Generates and returns accessToken and refreshToken pair.
 *
 * @param accessTokenPayload
 * @param refreshTokenPayload
 * @returns jwtPair
 */
function generateJWTPair(
	accessTokenPayload: iJWTPayload,
	refreshTokenPayload: iJWTPayload
): iTokenPair {
	const {algorithm, accessTokenExpiresIn, refreshTokenExpiresIn, secretKey} =
		config.jwtConfig;

	const accessTokenId = generateUUID();
	const refreshTokenId = generateUUID();

	const accessToken = jwt.sign(accessTokenPayload, secretKey, {
		algorithm,
		jwtid: accessTokenId,
		expiresIn: accessTokenExpiresIn,
	});

	const refreshToken = jwt.sign(refreshTokenPayload, secretKey, {
		algorithm,
		jwtid: refreshTokenId,
		expiresIn: refreshTokenExpiresIn,
	});

	return {
		accessToken,
		refreshToken,
	};
}

function verifyJWT(
	uniqueRequestId: NullableString,
	token: string
): {
	isValid: boolean;
	decodedToken: iJWTPayload | null;
} {
	try {
		const {secretKey} = config.jwtConfig;

		const decodedToken = jwt.verify(token, secretKey);

		if (decodedToken) {
			return {
				isValid: true,
				decodedToken: decodedToken as iJWTPayload,
			};
		}
		return {
			isValid: false,
			decodedToken: null,
		};
	} catch (error) {
		logger.error(uniqueRequestId, "Error while verifying JWT token", error);

		return {
			isValid: false,
			decodedToken: null,
		};
	}
}

export default {
	generateUUID,
	generateJWTPair,
	verifyJWT,
};
