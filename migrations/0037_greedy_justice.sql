ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-08-02T08:37:43.531Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-08-02T08:37:43.531Z';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "completed_at" text;