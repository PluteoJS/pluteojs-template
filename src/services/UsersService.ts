import logger from "@loaders/logger";

import {db} from "@db/index";

import serviceUtil from "@util/serviceUtil";

import {iGenericServiceResult} from "@customTypes/commonServiceTypes";
import {httpStatusCodes} from "@customTypes/networkTypes";
import {iUser} from "@customTypes/appDataTypes/userTypes";

import {usersServiceError} from "@constants/errors/usersServiceErrors";
import {NullableString} from "@customTypes/commonTypes";

export default class UsersService {
	public async getUserDetails(
		uniqueRequestId: NullableString,
		userId: string
	): Promise<iGenericServiceResult<iUser | null>> {
		return db.task("get-user-details", async (task) => {
			logger.silly("Retrieving the userRecord by user id");
			const userRecord = await task.users.findById(userId);

			if (userRecord) {
				logger.silly("Retrieved userRecord of the user with id as userId");
				const userDetails: iUser = {
					id: userRecord.id,
					email: userRecord.email,
					firstName: userRecord.first_name,
					lastName: userRecord.last_name,
					createdAt: userRecord.created_at,
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
		});
	}
}
