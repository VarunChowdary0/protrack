import {text , pgTable} from "drizzle-orm/pg-core";
import { timeLines } from "./TimeLineSchema";
import { FileType } from "@/types/timelineType";

export const documents = pgTable("documents",{
    id: text("id").primaryKey(),
    timelineId: text("timeline_id").references(() => timeLines.id, { onDelete: 'cascade' }), 
    name: text("name").notNull(), 
    description: text("description").notNull(),
    filePath: text("file_path").notNull(),
    fileType: text("file_type").$type<FileType>().notNull(),
});