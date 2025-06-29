import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { participants } from "../ParticipantSchema";
import { chats } from "./ChatSchema";
import { documents } from "../DoumentSchema";

export const chatMedia = pgTable("chat_media", {
    id: text("id").primaryKey(),
    chatId: text("chat_id").references(()=>chats.id, { onDelete: "cascade" }).notNull(),
    ownerId: text("owner_id").references(() => participants.id, { onDelete: "cascade" }).notNull(), 
    documentId: text("document_id").references(() => documents.id, { onDelete: "cascade" }).notNull(), // Reference to the document
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});