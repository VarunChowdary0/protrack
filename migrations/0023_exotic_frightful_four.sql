ALTER TABLE "projects" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "domain" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "max_team_size" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "site_link" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "repository_link" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "visibility" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "deadline" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "duration_in_days" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "tech_stack" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-27T15:29:05.346Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-27T15:29:05.347Z';--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "project_id" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "step_completed" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_draft" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;