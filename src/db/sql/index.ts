import {join as joinPath} from "path";

import {QueryFile, IQueryFileOptions} from "pg-promise";

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

///////////////////////////////////////////////////////////////////////////////////////////////
// Criteria for deciding whether to place a particular query into an external SQL file or to
// keep it in-line (hard-coded):
//
// - Size / complexity of the query, because having it in a separate file will let you develop
//   the query and see the immediate updates without having to restart your application.
//
// - The necessity to document your query, and possibly keeping its multiple versions commented
//   out in the query file.
//
// In fact, the only reason one might want to keep a query in-line within the code is to be able
// to easily see the relation between the query logic and its formatting parameters. However, this
// is very easy to overcome by using only Named Parameters for your query formatting.
////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// Possible alternative - enumerating all SQL files automatically:
// http://vitaly-t.github.io/pg-promise/utils.html#.enumSql

export const users = {
	create: sql("users/create.sql"),
	empty: sql("users/empty.sql"),
	init: sql("users/init.sql"),
	drop: sql("users/drop.sql"),
	add: sql("users/add.sql"),
};

export const emailLogs = {
	create: sql("emailLogs/create.sql"),
	add: sql("emailLogs/add.sql"),
};

export const resetPasswordLogs = {
	create: sql("resetPasswordLogs/create.sql"),
	add: sql("resetPasswordLogs/add.sql"),
};

export const emailVerificationRequestLogs = {
	create: sql("emailVerificationRequestLogs/create.sql"),
	add: sql("emailVerificationRequestLogs/add.sql"),
};
