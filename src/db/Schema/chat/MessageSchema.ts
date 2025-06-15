import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { chats } from "./ChatSchema";
import { group } from "./GroupSchema";
import { participants } from "../ParticipantSchema";
import { sql } from "drizzle-orm";

export const messages = pgTable("messages",{
    id: text("id").primaryKey(),
    reference_id: text("reference_id").references(
        () => chats.id || group.id ,
        { onDelete: "cascade" } 
    ),
    sender_id: text("sender_id").references(()=> participants.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // Type of message (e.g., text, image, file)
    content: text("content").notNull(), // Content of the message
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    isEdited: boolean("is_edited").default(false).notNull(), // Whether the message has been edited
    isDeleted: boolean("is_deleted").default(false).notNull(), // Whether the message has been deleted
})