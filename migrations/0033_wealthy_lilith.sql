ALTER TABLE "resources" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "owner_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "document_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-29T11:49:46.492Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-29T11:49:46.492Z';--> statement-breakpoint
ALTER TABLE "document_submissions" ADD COLUMN "reference_document_id" text;--> statement-breakpoint
ALTER TABLE "document_submissions" ADD CONSTRAINT "document_submissions_reference_document_id_requiredDocuments_id_fk" FOREIGN KEY ("reference_document_id") REFERENCES "public"."requiredDocuments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_submissions" ADD CONSTRAINT "unique_submission" UNIQUE("submitted_by","reference_document_id");