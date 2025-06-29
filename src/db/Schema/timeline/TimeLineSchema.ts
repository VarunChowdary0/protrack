import { TimelineEventType } from "@/types/timelineType";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { projects } from "../project/ProjectSchema";

export const timeLines = pgTable("time_lines", {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(()=> projects.id, { onDelete: "cascade"}).notNull(), // Reference to the project this timeline belongs to
    title: text("title").notNull(), // Title of the timeline entry
    description: text("description").notNull(), // Description of the timeline entry
    startDate: text("start_date").notNull(), // Date of the timeline entry
    endDate: text("end_date").notNull(), // End date of the timeline entry
    verifiedDocuments: integer("verified_documents").default(0).notNull(), // Number of verified documents in the timeline entry
    totalDocuments: integer("total_documents").notNull(), 
    status: text("status").$type<TimelineEventType>().default(TimelineEventType.PENDING).notNull(), // Status of the timeline entry (e.g., pending, completed, etc.)
    remarks: text("remarks").default("").notNull(), // Remarks or additional information about the timeline entry
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});