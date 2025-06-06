CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"description" text NOT NULL,
	"max_team_size" integer NOT NULL,
	"site_link" text NOT NULL,
	"repository_link" text NOT NULL,
	"location" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
