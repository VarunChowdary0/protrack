import { pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { FileType } from "@/types/documentType";

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").$type<FileType>().notNull(),
  
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
