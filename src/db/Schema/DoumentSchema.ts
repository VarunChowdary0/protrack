import {text , pgTable} from "drizzle-orm/pg-core";
import { timeLines } from "./TimeLineSchema";
import { FileType } from "@/types/timelineType";
import { sql } from "drizzle-orm";

export const documents = pgTable("documents",{
    id: text("id").primaryKey(),
    timelineId: text("timeline_id").references(() => timeLines.id, { onDelete: 'cascade' }), 
    name: text("name").notNull(), 
    description: text("description").notNull(),
    filePath: text("file_path").notNull(),
    fileType: text("file_type").$type<FileType>().notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    
});