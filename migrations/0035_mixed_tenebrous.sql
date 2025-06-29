ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-29T12:20:39.060Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-29T12:20:39.060Z';--> statement-breakpoint
ALTER TABLE "document_submissions" ADD COLUMN "status" text DEFAULT 'PENDING' NOT NULL;