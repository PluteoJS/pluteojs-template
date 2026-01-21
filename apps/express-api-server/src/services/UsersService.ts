import {db, eq, users} from "@pluteojs/database";

import logger from "@loaders/logger";

import {httpStatusCodes} from "@customTypes/networkTypes";
import type {iUser} from "@customTypes/appDataTypes/userTypes";

import {ServiceError} from "@errors/ServiceError";
import {usersServiceError} from "@constants/errors/usersServiceErrors";

export default class UsersService {
	public async getUserDetails(userId: string): Promise<iUser> {
		logger.silly("Retrieving the userRecord by user id");
		const userRecords = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		const userRecord = userRecords[0];

		if (userRecord) {
			logger.silly("Retrieved userRecord of the user with id as userId");
			const userDetails: iUser = {
				id: userRecord.id,
				name: userRecord.name,
				email: userRecord.email,
				emailVerified: userRecord.emailVerified,
				image: userRecord.image,
				createdAt: userRecord.createdAt?.toISOString() ?? "",
				updatedAt: userRecord.updatedAt?.toISOString() ?? "",
			};

			return userDetails;
		}

		logger.silly("No such userRecord with id as userId found");
		throw new ServiceError(
			httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
			usersServiceError.getUserDetails.UserDoesNotExists
		);
	}
}
