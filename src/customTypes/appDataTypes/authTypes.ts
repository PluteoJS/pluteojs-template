import {JwtPayload} from "jsonwebtoken";

enum AuthorizationTokenTypes {
	Bearer = "Bearer",
}

interface iJWTPayload extends JwtPayload {
	uid: string;
}
interface iTokenPair {
	accessToken: string;
	refreshToken: string;
}

interface iCredentials {
	email: string;
	password: string;
}
interface iResetPassRequestPayload {
	email: string;
}

interface iResetPassPayload {
	email: string;
	otp: string;
	newPassword: string;
}

export type {
	iJWTPayload,
	iTokenPair,
	iCredentials,
	AuthorizationTokenTypes,
	iResetPassRequestPayload,
	iResetPassPayload,
};
