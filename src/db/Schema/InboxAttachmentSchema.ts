import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { inbox } from "./InboxSchema";
import { sql } from "drizzle-orm";
import { FileType } from "@/types/documentType";

export const inboxAttachments = pgTable("inbox_attachments", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    inboxId: text("inbox_id").notNull().references(() => inbox.id, { onDelete: 'cascade' }),
    type: text("type").$type<FileType>().notNull(),
    size: integer("size").notNull(), // Size in bytes
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    
})