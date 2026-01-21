import {Router} from "express";

import authRoute from "./authRoute";
import usersRoute from "./usersRoute";
import verificationRoute from "./verificationRoute";

/**
 * Registers all v1 API routes.
 *
 * @returns Express router with all v1 routes mounted
 */
export const registerV1Routes = (): Router => {
	const v1Router = Router();

	// Authentication routes (Better Auth)
	authRoute(v1Router);

	// User routes
	usersRoute(v1Router);

	// Verification routes
	verificationRoute(v1Router);

	return v1Router;
};

export default registerV1Routes;
