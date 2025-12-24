import {relations} from "drizzle-orm";
import {
	boolean,
	index,
	inet,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

import {users} from "./users.schema";

export const resetPasswordLogs = pgTable(
	"reset_password_logs",
	{
		id: uuid("id").primaryKey(),
		userId: uuid("user_id").notNull(),
		email: varchar("email", {length: 225}),
		datetime: timestamp("datetime", {withTimezone: true}).notNull(),
		reqIpAddress: inet("req_ip_address"),
		otp: varchar("otp", {length: 256}).notNull(),
		isOtpUsable: boolean("is_otp_usable").notNull(),
		createdAt: timestamp("created_at", {withTimezone: true}),
	},
	(table) => [index("reset_password_logs_user_id_idx").on(table.userId)]
);

// Relations
export const resetPasswordLogsRelations = relations(
	resetPasswordLogs,
	({one}) => ({
		user: one(users, {
			fields: [resetPasswordLogs.userId],
			references: [users.id],
		}),
	})
);

// Type inference helpers
export type ResetPasswordLog = typeof resetPasswordLogs.$inferSelect;
export type NewResetPasswordLog = typeof resetPasswordLogs.$inferInsert;
