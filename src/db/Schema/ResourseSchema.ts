import { FileType } from "@/types/timelineType";
import {text , pgTable} from "drizzle-orm/pg-core";
import { projects } from "./ProjectSchema";
import { sql } from "drizzle-orm";

export const resources = pgTable("resources", {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(()=> projects.id, { onDelete:"cascade"}), // Foreign key to projects table
    name: text("name").notNull(), // Name of the resource
    description: text("description").notNull(), // Description of the resource
    type: text("type").$type<FileType>().notNull(), // Type of the resource (e.g., document, image, video)
    filePath: text("file_path").notNull(), // Path to the resource file
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})