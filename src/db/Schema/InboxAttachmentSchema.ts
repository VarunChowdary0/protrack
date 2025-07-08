import { pgTable, text } from "drizzle-orm/pg-core";
import { inbox } from "./InboxSchema";
import { sql } from "drizzle-orm";
import { documents } from "./DoumentSchema";

export const inboxAttachments = pgTable("inbox_attachments", {
    id: text("id").primaryKey(),
    inboxId: text("inbox_id").notNull().references(() => inbox.id, { onDelete: 'cascade' }),
    documentId: text("document_id").notNull().references(() => documents.id, { onDelete: 'cascade' }),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})