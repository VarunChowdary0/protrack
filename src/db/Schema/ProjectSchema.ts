import { Visibility } from "@/types/projectType";
import { sql } from "drizzle-orm";
import {text ,integer, pgTable, date} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    domain: text("domain").notNull(), 
    problemStatement: text("description").notNull(),
    max_team_size: integer("max_team_size").notNull(), // Maximum team size for the project`
    site_link: text("site_link").notNull(), // Link to the project site
    repositoryLink: text("repository_link").notNull(), // Link to the project repository
    
    visibility: text("visibility").$type<Visibility>().default(Visibility.PRIVATE).notNull(),
    deadline: date("deadline").notNull().default(sql`CURRENT_DATE`), // ISO date string for the project deadline
    durationInDays: integer("duration_in_days").notNull().default(30), // Duration in days for the project
    techStack: text("tech_stack").notNull(), // Tech stack used in the project, split by comma

    location: text("location").notNull(), // Location of the project, can be a city or region
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),

});
