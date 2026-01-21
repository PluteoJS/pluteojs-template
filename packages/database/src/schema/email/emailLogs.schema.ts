import {relations} from "drizzle-orm";
import {pgTable, text, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

import {users} from "../betterAuth/betterAuth.schema";

export const emailLogs = pgTable("email_logs", {
	id: uuid("id").primaryKey(),
	userId: uuid("user_id"),
	messageId: varchar("message_id", {length: 225}).notNull(),
	senderAddress: varchar("sender_address", {length: 225}).notNull(),
	targetAddress: varchar("target_address", {length: 225}).notNull(),
	subject: varchar("subject", {length: 225}),
	bodyType: varchar("body_type", {length: 225}).notNull(),
	body: text("body"),
	createdAt: timestamp("created_at", {withTimezone: true}),
});

// Relations
export const emailLogsRelations = relations(emailLogs, ({one}) => ({
	user: one(users, {
		fields: [emailLogs.userId],
		references: [users.id],
	}),
}));

// Type inference helpers
export type EmailLog = typeof emailLogs.$inferSelect;
export type NewEmailLog = typeof emailLogs.$inferInsert;
