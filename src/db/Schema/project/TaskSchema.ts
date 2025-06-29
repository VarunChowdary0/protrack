import {text ,integer, pgTable, boolean} from "drizzle-orm/pg-core";
import { projects } from "./ProjectSchema";
import { participants } from "../ParticipantSchema";
import { TaskStatus } from "@/types/taskTypes";
import { sql } from "drizzle-orm";

export const tasks = pgTable("tasks", {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }), // Foreign key to projects table
    title: text("title").notNull(),
    description: text("description").notNull(),
    dueDate: text("due_date").notNull(),
    assignedTo_id: text("assigned_to_id").references(()=> participants.id, { onDelete : "cascade"}),
    assignedBy_id: text("assigned_by_id").references(()=> participants.id, { onDelete : "cascade"}), 
    isPlanned: boolean("is_planned").notNull().default(false),
    isImportant: boolean("is_important").notNull().default(false), 
    status: text("status").$type<TaskStatus>().default(TaskStatus.PENDING).notNull(), // 
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    priority: integer("priority").notNull().default(0),
});