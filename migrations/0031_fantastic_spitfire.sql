ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-29T07:41:35.827Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-29T07:41:35.829Z';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "project_id" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "chat_id" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "context_type" text DEFAULT 'timeline' NOT NULL;--> statement-breakpoint
ALTER TABLE "time_lines" ADD COLUMN "verified_documents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;