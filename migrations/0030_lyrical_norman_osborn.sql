ALTER TABLE "participants" DROP CONSTRAINT "participants_user_id_project_id_pk";--> statement-breakpoint
ALTER TABLE "participants" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "participants" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-28T04:56:56.412Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-28T04:56:56.412Z';--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;