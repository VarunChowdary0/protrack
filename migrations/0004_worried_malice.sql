ALTER TABLE "activities" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T13:15:03.699Z';--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.699Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T13:15:03.714Z';--> statement-breakpoint
ALTER TABLE "calendar" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.714Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "joined_at" SET DEFAULT '2025-06-08T13:15:03.723Z';--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.723Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T13:15:03.723Z';--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.723Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "timestamp" SET DEFAULT '2025-06-08T13:15:03.726Z';--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.727Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T13:15:03.741Z';--> statement-breakpoint
ALTER TABLE "inbox" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.741Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T13:15:03.696Z';--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.696Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T13:15:03.744Z';--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.745Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T13:15:03.750Z';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.750Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "created_at" SET DEFAULT '2025-06-08T13:15:03.735Z';--> statement-breakpoint
ALTER TABLE "time_lines" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-08T13:15:03.735Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "organization_id" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_password_change" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_password_change" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_email_change" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_email_change" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_phone_change" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_phone_change" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "accessTable" ADD COLUMN "manageGroups" boolean DEFAULT true;