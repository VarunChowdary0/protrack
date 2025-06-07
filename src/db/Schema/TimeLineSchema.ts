import { TimelineEventType } from "@/types/timelineType";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { projects } from "./ProjectSchema";

export const timeLines = pgTable("time_lines", {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(()=> projects.id, { onDelete: "cascade"}), // Reference to the project this timeline belongs to
    title: text("title").notNull(), // Title of the timeline entry
    description: text("description").notNull(), // Description of the timeline entry
    startDate: text("start_date").notNull(), // Date of the timeline entry
    endDate: text("end_date").notNull(), // End date of the timeline entry
    totalDocuments: integer("total_documents").notNull(), 
    status: text("status").$type<TimelineEventType>().default(TimelineEventType.PENDING), 
    remarks: text("remarks").default(""),    
    createdAt: text("created_at").default(new Date().toISOString()).notNull(), // Creation timestamp
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull() // Last update timestamp`
});