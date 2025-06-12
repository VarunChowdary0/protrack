CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"notification_json" json
);
--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.762Z';--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.763Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.802Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.802Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "joined_at" SET DEFAULT '2025-06-12T12:38:07.830Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.830Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.829Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.830Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "timestamp" SET DEFAULT '2025-06-12T12:38:07.841Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.841Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.889Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.889Z';--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "role" SET DEFAULT 'organization_user';--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.907Z';--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.907Z';--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.802Z';--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.802Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.754Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.755Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.925Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.925Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.939Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.939Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.865Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.865Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-12T12:38:07.802Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-12T12:38:07.802Z';--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;