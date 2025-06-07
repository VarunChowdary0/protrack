import {text ,integer, pgTable} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    domain: text("domain").notNull(), 
    problemStatement: text("description").notNull(),
    max_team_size: integer("max_team_size").notNull(), // Maximum team size for the project`
    site_link: text("site_link").notNull(), // Link to the project site
    repositoryLink: text("repository_link").notNull(), // Link to the project repository
    location: text("location").notNull(), // Location of the project, can be a city or region
    createdAt: text("created_at").default(new Date().toISOString()).notNull(),
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull(),

});
