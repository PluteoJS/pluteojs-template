/**
 * The implementations on this file is mainly adopted from:
 * https://github.com/vitaly-t/pg-promise-demo/blob/3e5b6d78decc7913ea7dbc687941c48632a54869/TypeScript/db/sql/index.ts
 *
 * Please refer the following links for additional references:
 * 1. Solution for ts(2349): https://stackoverflow.com/a/67086460/6793156
 *
 */
import pgPromise, {IInitOptions, IDatabase, IMain} from "pg-promise";

import {
	iDBInterfaceExtensions,
	UsersRepository,
	EmailLogsRepository,
	ResetPasswordRepository,
	EmailVerificationRequestLogsRepository,
} from "@db/repositories/index";

import {Diagnostics} from "@db/diagnostics"; // optional diagnostics

import config from "@config";

const dbConfig = {
	host: config.database.host,
	port: Number(config.database.port),
	database: config.database.dbName,
	user: config.database.user,
	password: config.database.password,
};

type ExtendedProtocol = IDatabase<iDBInterfaceExtensions> &
	iDBInterfaceExtensions;

/**
 * pg-promise initialization options:
 */
const initOptions: IInitOptions<iDBInterfaceExtensions> = {
	/**
	 * Extending the database protocol with our custom repositories.
	 *
	 * API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
	 *
	 * @param obj
	 * NOTE: The second @param dc - Database Context (dc) is mainly needed for extending
	 * multiple databases with different access API. This has been removed from the current
	 * implementation as it is not in use.
	 */
	extend(obj: ExtendedProtocol) {
		/*
			Do not use 'require()' here, because this event occurs for every task and transaction being executed,
			which should be as fast as possible.
		*/
		obj.users = new UsersRepository(obj, pgp);
		obj.emailLogs = new EmailLogsRepository(obj, pgp);
		obj.resetPasswordLogs = new ResetPasswordRepository(obj, pgp);
		obj.emailVerificationRequestLogs =
			new EmailVerificationRequestLogsRepository(obj, pgp);
	},
};

// Initializing the pg-promise library:
const pgp: IMain = pgPromise(initOptions);

// Creating the database instance with extensions:
const db: ExtendedProtocol = pgp(dbConfig);

// Initializing optional diagnostics:
Diagnostics.init(initOptions);

/**
 * Alternatively, you can get access to pgp via db.$config.pgp
 * See: https://vitaly-t.github.io/pg-promise/Database.html#$config
 */
export {db, pgp};
