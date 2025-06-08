ALTER TABLE "activities" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.318Z';--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.318Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.334Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.334Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "joined_at" SET DEFAULT '2025-06-08T14:04:38.343Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.343Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.343Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.343Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "timestamp" SET DEFAULT '2025-06-08T14:04:38.346Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.346Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.362Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.362Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.314Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.315Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.365Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.365Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.370Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.370Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.356Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.356Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "organization_id" SET DEFAULT '1';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T14:04:38.334Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T14:04:38.334Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_password_change" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_password_change" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_email_change" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_email_change" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_phone_change" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_phone_change" SET DEFAULT '';