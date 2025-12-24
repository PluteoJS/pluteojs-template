import type {JwtPayload} from "jsonwebtoken";

export enum AuthorizationTokenTypes {
	Bearer = "Bearer",
}

export interface iJWTPayload extends JwtPayload {
	uid: string;
}

export interface iTokenPair {
	accessToken: string;
	refreshToken: string;
}

export interface iCredentials {
	email: string;
	password: string;
}

export interface iResetPassRequestPayload {
	email: string;
}

export interface iResetPassPayload {
	email: string;
	otp: string;
	newPassword: string;
}
