import { pgTable, text } from "drizzle-orm/pg-core";
import { projects } from "./ProjectSchema";
import { activityStatus } from "@/types/activityType";


export const activities = pgTable("activities", {
    id: text("id").primaryKey(),
    projectId: text("project_id")
                    .references(
                            () => projects.id,
                            { onDelete: 'cascade' }
                        ), 
    date: text('date').notNull(),
    status: text("status").$type<activityStatus>().default(activityStatus.PENDING),
    title   : text("title").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    createdAt: text("created_at").default(new Date().toISOString()).notNull(),
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull() 
})