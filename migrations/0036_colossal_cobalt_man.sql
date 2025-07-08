ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-07-08T10:58:52.337Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-07-08T10:58:52.338Z';--> statement-breakpoint
ALTER TABLE "inbox_attachments" ADD COLUMN "document_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "inbox_attachments" ADD CONSTRAINT "inbox_attachments_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox_attachments" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "inbox_attachments" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "inbox_attachments" DROP COLUMN "size";