import {
	boolean,
	index,
	inet,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const emailVerificationRequestLogs = pgTable(
	"email_verification_request_logs",
	{
		id: uuid("id").primaryKey(),
		email: varchar("email", {length: 225}),
		reqDateTime: timestamp("req_date_time", {withTimezone: true}).notNull(),
		reqIpAddress: inet("req_ip_address"),
		otp: varchar("otp", {length: 256}).notNull(),
		isOtpUsable: boolean("is_otp_usable").notNull(),
		createdAt: timestamp("created_at", {withTimezone: true}),
		updatedAt: timestamp("updated_at", {withTimezone: true}),
	},
	(table) => [index("email_verification_request_logs_email_idx").on(table.email)]
);

// Type inference helpers
export type EmailVerificationRequestLog =
	typeof emailVerificationRequestLogs.$inferSelect;
export type NewEmailVerificationRequestLog =
	typeof emailVerificationRequestLogs.$inferInsert;
