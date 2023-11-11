import {IDatabase, IMain} from "pg-promise";
import {IResult} from "pg-promise/typescript/pg-subset";

import {iUserModel} from "@db/models/user.model";

import {users as sql} from "@db/sql";
import {NullableString} from "@customTypes/commonTypes";

/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/

export default class UsersRepository {
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
	 * Creates the user table.
	 *
	 * @returns null
	 */
	async create(): Promise<null> {
		return this.db.none(sql.create);
	}

	/**
	 * Initializes the table with some user records, and return their id-s.
	 *
	 * @returns multiUserId
	 */
	async init(): Promise<number[]> {
		return this.db.map(sql.init, [], (row: {id: number}) => {
			return row.id;
		});
	}

	// Drops the table;
	async drop(): Promise<null> {
		return this.db.none(sql.drop);
	}

	// Removes all records from the table;
	async empty(): Promise<null> {
		return this.db.none(sql.empty);
	}

	// Adds a new user, and returns the new object;
	async add(
		id: string,
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: NullableString,
		password: string
	): Promise<iUserModel> {
		return this.db.one(sql.add, {
			id,
			firstName,
			lastName,
			email,
			phoneNumber,
			password,
		});
	}

	// Tries to delete a user by id, and returns the number of records deleted;
	async remove(id: string): Promise<number> {
		return this.db.result(
			"DELETE FROM users WHERE id = $1",
			+id,
			(r: IResult) => {
				return r.rowCount;
			}
		);
	}

	// Tries to find a user from id;
	async findById(id: string): Promise<iUserModel | null> {
		return this.db.oneOrNone("SELECT * FROM users WHERE id = $1", id);
	}

	async findByEmail(email: string): Promise<iUserModel | null> {
		return this.db.oneOrNone("SELECT * FROM users WHERE email = $1", email);
	}

	// Tries to find a user from name;
	async findByName(name: string): Promise<iUserModel | null> {
		return this.db.oneOrNone("SELECT * FROM users WHERE name = $1", name);
	}

	// Returns all user records;
	async all(): Promise<iUserModel[]> {
		return this.db.any("SELECT * FROM users");
	}

	// Returns the total number of users;
	async total(): Promise<number> {
		return this.db.one(
			"SELECT count(*) FROM users",
			[],
			(a: {count: string}) => {
				return +a.count;
			}
		);
	}

	// Update the password
	async updatePassword(newPassword: string, userId: string): Promise<null> {
		return this.db.none("UPDATE users SET password = $1 WHERE id = $2", [
			newPassword,
			userId,
		]);
	}
}
