ALTER TABLE "document_submissions" ALTER COLUMN "reference_document_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-29T11:57:39.931Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-29T11:57:39.931Z';