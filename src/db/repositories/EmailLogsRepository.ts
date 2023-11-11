import {IDatabase, IMain} from "pg-promise";

import {iEmailLogModel} from "db/models/emailLogs.model";

import {emailLogs as sql} from "@db/sql";

import {emailBodyTypes} from "@constants/emailServiceConstants";
import {NullableString} from "@customTypes/commonTypes";

/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/

export default class EmailLogsRepository {
	/**
	 * @param db
	 * Automated database connection context/interface.
	 *
	 * If you ever need to access other repositories from this one,
	 * you will have to replace type 'IDatabase<any>' with 'any'.
	 *
	 * @param pgp
	 * Library's root, if ever needed, like to access 'helpers'
	 * or other namespaces available from the root.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(private db: IDatabase<any>, private pgp: IMain) {
		/*
          If your repository needs to use helpers like ColumnSet,
          you should create it conditionally, inside the constructor,
          i.e. only once, as a singleton.
        */
	}

	/**
	 * Creates the email_logs table.
	 *
	 * @returns null
	 */
	async create(): Promise<null> {
		return this.db.none(sql.create);
	}

	// Adds a new email log, and returns the new object;
	async add(
		id: string,
		userId: NullableString,
		messageId: string,
		senderAddress: string,
		targetAddress: string,
		subject: string,
		bodyType: emailBodyTypes,
		body: string
	): Promise<iEmailLogModel> {
		return this.db.one(sql.add, {
			id,
			userId,
			messageId,
			senderAddress,
			targetAddress,
			subject,
			bodyType,
			body,
		});
	}

	// Returns all email logs records;
	async all(): Promise<iEmailLogModel[]> {
		return this.db.any("SELECT * FROM email_logs");
	}
}
