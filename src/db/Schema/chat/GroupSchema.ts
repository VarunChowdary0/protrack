import { pgTable, text } from "drizzle-orm/pg-core";
import { projects } from "../ProjectSchema";
import { sql } from "drizzle-orm";

export const group = pgTable("group", {
    id: text("id").primaryKey(),
    name: text("name").notNull(), // Name of the group
    description: text("description").notNull(), // Description of the group
    projectId: text("project_id").references(()=> projects.id, { onDelete : "cascade"} ),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})