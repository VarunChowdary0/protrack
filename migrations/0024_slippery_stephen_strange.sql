ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-06-27T17:15:39.841Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-06-27T17:15:39.842Z';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "creator_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;