import {index, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey(),
		firstName: varchar("first_name", {length: 225}).notNull(),
		lastName: varchar("last_name", {length: 225}).notNull(),
		email: varchar("email", {length: 225}).notNull(),
		phoneNumber: varchar("phone_number", {length: 32}),
		password: varchar("password", {length: 256}),
		createdAt: timestamp("created_at", {withTimezone: true}),
	},
	(table) => [index("users_email_idx").on(table.email)]
);

// Type inference helpers
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
