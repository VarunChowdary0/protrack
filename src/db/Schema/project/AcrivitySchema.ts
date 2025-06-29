import { pgTable, text } from "drizzle-orm/pg-core";
import { activityStatus } from "@/types/activityType";
import { sql } from "drizzle-orm";
import { projects } from "./ProjectSchema";


export const activities = pgTable("activities", {
    id: text("id").primaryKey(),
    projectId: text("project_id")
                    .references(
                            () => projects.id,
                            { onDelete: 'cascade' }
                        ).notNull(), 
    date: text('date').notNull(),
    status: text("status").$type<activityStatus>().default(activityStatus.PENDING).notNull(),
    title   : text("title").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),

})