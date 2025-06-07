CREATE TABLE "activities" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"date" text NOT NULL,
	"status" text DEFAULT 'pending',
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"created_at" text DEFAULT '2025-06-07T18:49:31.131Z' NOT NULL,
	"updated_at" text DEFAULT '2025-06-07T18:49:31.131Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar" (
	"id" text PRIMARY KEY NOT NULL,
	"participant_id" text,
	"project_id" text,
	"date" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" text DEFAULT '2025-06-07T18:49:31.183Z' NOT NULL,
	"updated_at" text DEFAULT '2025-06-07T18:49:31.183Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id_1" text,
	"user_id_2" text
);
--> statement-breakpoint
CREATE TABLE "group_member" (
	"id" text PRIMARY KEY NOT NULL,
	"group_id" text,
	"user_id" text,
	"is_admin" boolean DEFAULT false NOT NULL,
	"joined_at" text DEFAULT '2025-06-07T18:49:31.212Z' NOT NULL,
	"updated_at" text DEFAULT '2025-06-07T18:49:31.212Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"project_id" text,
	"created_at" text DEFAULT '2025-06-07T18:49:31.211Z' NOT NULL,
	"updated_at" text DEFAULT '2025-06-07T18:49:31.211Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"reference_id" text,
	"sender_id" text,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"timestamp" text DEFAULT '2025-06-07T18:49:31.221Z' NOT NULL,
	"updated_at" text DEFAULT '2025-06-07T18:49:31.221Z' NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"timeline_id" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"file_path" text NOT NULL,
	"file_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inbox_attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"inbox_id" text NOT NULL,
	"type" text NOT NULL,
	"size" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inbox" (
	"id" text PRIMARY KEY NOT NULL,
	"from_id" text,
	"participant_id" text,
	"user_id" text,
	"project_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"seen_at" text DEFAULT '',
	"is_archived" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_starred" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT '2025-06-07T18:49:31.261Z' NOT NULL,
	"updated_at" text DEFAULT '2025-06-07T18:49:31.261Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"file_path" text NOT NULL,
	"created_at" text DEFAULT '2025-06-07T18:49:31.272Z' NOT NULL,
	"updated_at" text DEFAULT '2025-06-07T18:49:31.272Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_lines" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"total_documents" integer NOT NULL,
	"status" text DEFAULT 'PENDING',
	"remarks" text DEFAULT '',
	"created_at" text DEFAULT '2025-06-07T18:49:31.244Z' NOT NULL,
	"updated_at" text DEFAULT '2025-06-07T18:49:31.244Z' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:49:31.119Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:49:31.120Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:49:31.284Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:49:31.284Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-07T18:49:31.183Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-07T18:49:31.183Z';--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar" ADD CONSTRAINT "calendar_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar" ADD CONSTRAINT "calendar_project_id_participants_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."participants"("project_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_1_participants_id_fk" FOREIGN KEY ("user_id_1") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_2_participants_id_fk" FOREIGN KEY ("user_id_2") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_participants_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_project_id_participants_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."participants"("project_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_reference_id_chats_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_participants_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_timeline_id_time_lines_id_fk" FOREIGN KEY ("timeline_id") REFERENCES "public"."time_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox_attachments" ADD CONSTRAINT "inbox_attachments_inbox_id_inbox_id_fk" FOREIGN KEY ("inbox_id") REFERENCES "public"."inbox"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox" ADD CONSTRAINT "inbox_from_id_participants_id_fk" FOREIGN KEY ("from_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox" ADD CONSTRAINT "inbox_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox" ADD CONSTRAINT "inbox_user_id_participants_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."participants"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbox" ADD CONSTRAINT "inbox_project_id_participants_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."participants"("project_id") ON DELETE cascade ON UPDATE no action;