import {join as joinPath} from "path";

import type {IQueryFileOptions} from "pg-promise";
import {QueryFile} from "pg-promise";

import logger from "@loaders/logger";

/**
 * Helper for linking to external query files.
 *
 * @param file
 * @returns queryFile
 */
function sql(file: string): QueryFile {
	const fullPath: string = joinPath(__dirname, file); // generating full path;

	const options: IQueryFileOptions = {
		// minifying the SQL is always advised;
		// see also option 'compress' in the API;
		minify: true,

		// See also property 'params' for two-step template formatting
	};

	const queryFile: QueryFile = new QueryFile(fullPath, options);

	if (queryFile.error) {
		// Something is wrong with our query file :(
		// Testing all files through queries can be cumbersome,
		// so we also report it here, while loading the module:
		logger.loggerInstance.error(queryFile.error);
	}

	return queryFile;

	// See QueryFile API:
	// http://vitaly-t.github.io/pg-promise/QueryFile.html
}

export const users = {
	create: sql("users/create.sql"),
	empty: sql("users/empty.sql"),
	init: sql("users/init.sql"),
	drop: sql("users/drop.sql"),
	add: sql("users/add.sql"),
};

export const emailLogs = {
	create: sql("email_logs/create.sql"),
	add: sql("email_logs/add.sql"),
};

export const resetPasswordLogs = {
	create: sql("reset_password_logs/create.sql"),
	add: sql("reset_password_logs/add.sql"),
};

export const emailVerificationRequestLogs = {
	create: sql("email_verification_request_logs/create.sql"),
	add: sql("email_verification_request_logs/add.sql"),
};
