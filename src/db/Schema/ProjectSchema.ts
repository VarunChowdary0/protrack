import { ProjectStatus, Visibility } from "@/types/projectType";
import { sql } from "drizzle-orm";
import {text ,integer, pgTable, date} from "drizzle-orm/pg-core";
import { organizations } from "./OrganizationSchema";
import { users } from "./UserSchema";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  organization_id: text("organization_id").references(()=> organizations.id, { onDelete: "cascade" }).notNull(),
  creator_id: text("creator_id").references(() => users.id, { onDelete: "cascade" }).notNull(),

  // Step 1 fields
  code: text("code").default("").notNull(),
  name: text("name").default("").notNull(),
  domain: text("domain").default("").notNull(),
  problemStatement: text("description").default("").notNull(),


  // Step 2 fields
  max_team_size: integer("max_team_size").default(5).notNull(), // Maximum team size for the project
  site_link: text("site_link").default("").notNull(), // Link to the project site
  repositoryLink: text("repository_link").default("").notNull(), // Link to the project repository

  visibility: text("visibility").$type<Visibility>().default(Visibility.PRIVATE).notNull(), // Visibility of the project (public, private, restricted)
  deadline: date("deadline").default(sql`CURRENT_DATE`).notNull(), // Deadline for the project, stored as a date
  durationInDays: integer("duration_in_days").default(30).notNull(), // Duration of the project in days
  techStack: text("tech_stack").default("").notNull(), // Comma-separated list of technologies used in the project
  location: text("location").default("").notNull(), // Location of the project, can be a city or region

  // Status tracking
  stepCompleted: integer("step_completed").default(0).notNull(), // Current step completed
  isDraft: integer("is_draft").default(1).notNull(), // 1 = draft, 0 = published


  status: text("status").$type<ProjectStatus>().default(ProjectStatus.NOT_STARTED).notNull(), // Current status of the project

  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
