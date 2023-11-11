import {IDatabase, IMain} from "pg-promise";

import {iEmailVerificationRequestLogsModel} from "@db/models/emailVerificationRequestLogs.model";

import {emailVerificationRequestLogs as sql} from "@db/sql";
import {NullableString} from "@customTypes/commonTypes";

/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/

export default class EmailVerificationRequestLogsRepository {
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
	 * Creates the email_verification_request_logs table.
	 *
	 * @returns null
	 */
	async create(): Promise<null> {
		return this.db.none(sql.create);
	}

	// Adds a new email verification request log, and returns the new object;
	async add(
		id: string,
		email: string,
		reqIpAddress: NullableString,
		otp: string,
		isOtpUsable: boolean
	): Promise<iEmailVerificationRequestLogsModel> {
		return this.db.one(sql.add, {
			id,
			email,
			reqIpAddress,
			otp,
			isOtpUsable,
		});
	}

	// Tries to find an email verification request log by id;
	async findById(
		id: string
	): Promise<iEmailVerificationRequestLogsModel | null> {
		return this.db.oneOrNone(
			"SELECT * FROM email_verification_request_logs WHERE id = $1",
			id
		);
	}

	// Returns all venues records;
	async all(): Promise<iEmailVerificationRequestLogsModel[]> {
		return this.db.any("SELECT * FROM email_verification_request_logs");
	}

	/**
	 * Returns the latest email verification request log by user email.
	 *
	 * @param email - email to verify
	 * @returns iEmailVerificationRequestLogsModel | null
	 */
	async selectLatestRequestByUserEmail(
		email: string
	): Promise<iEmailVerificationRequestLogsModel | null> {
		return this.db.oneOrNone(
			"SELECT * FROM email_verification_request_logs WHERE email = $1 ORDER BY req_date_time DESC LIMIT 1",
			email
		);
	}

	/**
	 * Invalidates the otp by id.
	 *
	 * @param id - id of the email verification request log
	 * @returns Promise<null>
	 */
	async invalidateOtp(id: string): Promise<null> {
		return this.db.none(
			"UPDATE email_verification_request_logs SET is_otp_usable = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
			id
		);
	}

	/**
	 * Updates the request date time by id.
	 *
	 * @param id - id of the email verification request log
	 * @returns Promise<null>
	 * */
	async updateRequestDateTime(id: string): Promise<null> {
		return this.db.none(
			"UPDATE email_verification_request_logs SET req_date_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
			id
		);
	}
}
