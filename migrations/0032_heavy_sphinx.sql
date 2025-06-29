CREATE TABLE "chat_media" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"document_id" text NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"timeline_id" text NOT NULL,
	"submitted_by" text NOT NULL,
	"document_id" text NOT NULL,
	"remarks" text,
	"reviewed_at" text,
	"reviewed_by" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requiredDocuments" (
	"id" text PRIMARY KEY NOT NULL,
	"timeline_id" text NOT NULL,
	"reference_document_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_timeline_id_time_lines_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_chat_id_chats_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-29T09:32:11.692Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-29T09:32:11.693Z';--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "document_id" text;--> statement-breakpoint
ALTER TABLE "chat_media" ADD CONSTRAINT "chat_media_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_media" ADD CONSTRAINT "chat_media_owner_id_participants_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_media" ADD CONSTRAINT "chat_media_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_submissions" ADD CONSTRAINT "document_submissions_timeline_id_time_lines_id_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."time_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_submissions" ADD CONSTRAINT "document_submissions_submitted_by_participants_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_submissions" ADD CONSTRAINT "document_submissions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_submissions" ADD CONSTRAINT "document_submissions_reviewed_by_participants_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."participants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requiredDocuments" ADD CONSTRAINT "requiredDocuments_timeline_id_time_lines_id_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."time_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requiredDocuments" ADD CONSTRAINT "requiredDocuments_reference_document_id_documents_id_fk" FOREIGN KEY ("reference_document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_participants_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "timeline_id";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "project_id";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "chat_id";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "context_type";--> statement-breakpoint
ALTER TABLE "resources" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "resources" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "resources" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "resources" DROP COLUMN "file_path";