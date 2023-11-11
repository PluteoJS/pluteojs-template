import {IDatabase, IMain} from "pg-promise";

import {iPasswordResetLogModel} from "@db/models/resetPasswordLogs.model";

import {resetPasswordLogs as sql} from "@db/sql";
import {NullableString} from "@customTypes/commonTypes";
/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/

export default class ResetPasswordRepository {
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

	// Adds a new reset password log, and returns the new object;
	async add(
		id: string,
		userId: string,
		email: string,
		requestIPAddress: NullableString,
		otp: string,
		isOtpUsable: boolean
	): Promise<iPasswordResetLogModel> {
		return this.db.one(sql.add, {
			id,
			userId,
			email,
			requestIPAddress,
			otp,
			isOtpUsable,
		});
	}

	// Returns all reset password logs records;
	async all(): Promise<iPasswordResetLogModel[]> {
		return this.db.any("SELECT * FROM reset_password_logs");
	}

	//Return only last record of a specific user
	async selectLatestReq(
		userId: string
	): Promise<iPasswordResetLogModel | null> {
		return this.db.oneOrNone(
			"SELECT * FROM reset_password_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
			userId
		);
	}

	async invalidateOtp(userId: string): Promise<null> {
		return this.db.none(
			"UPDATE reset_password_logs SET is_otp_usable = false where user_id = $1",
			userId
		);
	}
}
