CREATE TABLE "accessTable" (
	"userRole" text PRIMARY KEY DEFAULT 'user' NOT NULL,
	"createOrganization" boolean DEFAULT false,
	"accessOrganization" boolean DEFAULT false,
	"manageOrganization" boolean DEFAULT false,
	"createOrganizationManagers" boolean DEFAULT false,
	"accessOrganizationManagers" boolean DEFAULT false,
	"createOrganizationUsers" boolean DEFAULT false,
	"accessOrganizationUsers" boolean DEFAULT false,
	"accessProjects" boolean DEFAULT true,
	"createProjects" boolean DEFAULT false,
	"editProjects" boolean DEFAULT false,
	"deleteProjects" boolean DEFAULT false,
	"accessTeam" boolean DEFAULT true,
	"mapTeam" boolean DEFAULT false,
	"accessTimeline" boolean DEFAULT true,
	"manageTimeline" boolean DEFAULT false,
	"accessActivities" boolean DEFAULT true,
	"manageActivities" boolean DEFAULT false,
	"accessResources" boolean DEFAULT true,
	"manageResources" boolean DEFAULT true,
	"deleteResources" boolean DEFAULT false,
	"accessTasks" boolean DEFAULT true,
	"hold_cancle_tasks" boolean DEFAULT false,
	"assignTasks" boolean DEFAULT false,
	"accessCalendar" boolean DEFAULT true,
	"manageCalendar" boolean DEFAULT false,
	"accessChat" boolean DEFAULT true,
	"createGroups" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.421Z';--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.421Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.437Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.437Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "joined_at" SET DEFAULT '2025-06-08T07:33:15.449Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.449Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.449Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.449Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "timestamp" SET DEFAULT '2025-06-08T07:33:15.453Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.453Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.470Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.470Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.418Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.419Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.474Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.474Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.481Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.481Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.463Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.463Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T07:33:15.437Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T07:33:15.437Z';