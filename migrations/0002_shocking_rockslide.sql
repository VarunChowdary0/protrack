ALTER TABLE "calendar" DROP CONSTRAINT "calendar_project_id_participants_project_id_fk";
--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "group_project_id_participants_project_id_fk";
--> statement-breakpoint
ALTER TABLE "inbox" DROP CONSTRAINT "inbox_user_id_participants_user_id_fk";
--> statement-breakpoint
ALTER TABLE "inbox" DROP CONSTRAINT "inbox_project_id_participants_project_id_fk";
--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:44.967Z';--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:44.967Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:45.025Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.025Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "joined_at" SET DEFAULT '2025-06-07T18:53:45.062Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.062Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:45.061Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.061Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "timestamp" SET DEFAULT '2025-06-07T18:53:45.075Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.075Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:45.129Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.129Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:44.957Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:44.958Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:45.142Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.142Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:45.169Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.169Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:45.105Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.105Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:53:45.024Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:53:45.024Z';--> statement-breakpoint
ALTER TABLE "calendar" ADD CONSTRAINT "calendar_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox" ADD CONSTRAINT "inbox_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox" ADD CONSTRAINT "inbox_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_lines" ADD CONSTRAINT "time_lines_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;