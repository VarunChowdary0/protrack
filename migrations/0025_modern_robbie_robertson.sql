ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-27T18:35:34.673Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-27T18:35:34.673Z';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "status" text DEFAULT 'not_started' NOT NULL;