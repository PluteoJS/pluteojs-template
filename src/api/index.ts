import {Router} from "express";

import authRoute from "@api/routes/authRoute";
import userRoute from "@api/routes/usersRoute";
import verificationRoute from "@api/routes/verificationRoute";

const getRouter = (): Router => {
	const apiRouter = Router();

	// connecting all api routes
	authRoute(apiRouter);
	userRoute(apiRouter);
	verificationRoute(apiRouter);

	return apiRouter;
};

export default getRouter;
