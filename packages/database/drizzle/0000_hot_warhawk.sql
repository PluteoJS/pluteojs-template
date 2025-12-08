CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(225) NOT NULL,
	"last_name" varchar(225) NOT NULL,
	"email" varchar(225) NOT NULL,
	"phone_number" varchar(32),
	"password" varchar(256),
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reset_password_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"email" varchar(225),
	"datetime" timestamp with time zone NOT NULL,
	"req_ip_address" "inet",
	"otp" varchar(256) NOT NULL,
	"is_otp_usable" boolean NOT NULL,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"message_id" varchar(225) NOT NULL,
	"sender_address" varchar(225) NOT NULL,
	"target_address" varchar(225) NOT NULL,
	"subject" varchar(225),
	"body_type" varchar(225) NOT NULL,
	"body" text,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "email_verification_request_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(225),
	"req_date_time" timestamp with time zone NOT NULL,
	"req_ip_address" "inet",
	"otp" varchar(256) NOT NULL,
	"is_otp_usable" boolean NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "reset_password_logs_user_id_idx" ON "reset_password_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_verification_request_logs_email_idx" ON "email_verification_request_logs" USING btree ("email");