import {db, eq, users} from "@pluteojs/database";

import logger from "@loaders/logger";
import serviceUtil from "@util/serviceUtil";

import type {iGenericServiceResult} from "@customTypes/serviceTypes";
import {httpStatusCodes} from "@customTypes/networkTypes";
import type {iUser} from "@customTypes/appDataTypes/userTypes";

import {usersServiceError} from "@constants/errors/usersServiceErrors";
import type {NullableString} from "@customTypes/commonTypes";

export default class UsersService {
	public async getUserDetails(
		uniqueRequestId: NullableString,
		userId: string
	): Promise<iGenericServiceResult<iUser | null>> {
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
				email: userRecord.email,
				firstName: userRecord.firstName,
				lastName: userRecord.lastName,
				createdAt: userRecord.createdAt?.toISOString() ?? "",
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				userDetails
			);
		}

		logger.silly("No such userRecord with id as userId found");
		return serviceUtil.buildResult(
			false,
			httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
			uniqueRequestId,
			usersServiceError.getUserDetails.UserDoesNotExists
		);
	}
}
