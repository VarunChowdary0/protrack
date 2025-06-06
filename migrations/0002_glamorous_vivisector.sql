CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"organization_id" text,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	"is_active" text DEFAULT 'true' NOT NULL,
	"is_email_verified" text DEFAULT 'false' NOT NULL,
	"is_phone_verified" text DEFAULT 'false' NOT NULL,
	"phone_number" text DEFAULT '' NOT NULL,
	"profile_picture" text DEFAULT '' NOT NULL,
	"last_login" text DEFAULT '' NOT NULL,
	"last_password_change" text DEFAULT '' NOT NULL,
	"last_email_change" text DEFAULT '' NOT NULL,
	"last_phone_change" text DEFAULT '' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;