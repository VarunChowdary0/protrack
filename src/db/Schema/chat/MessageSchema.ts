import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { chats } from "./ChatSchema";
import { group } from "./GroupSchema";
import { participants } from "../ParticipantSchema";

export const messages = pgTable("messages",{
    id: text("id").primaryKey(),
    reference_id: text("reference_id").references(
        () => chats.id || group.id ,
        { onDelete: "cascade" } 
    ),
    sender_id: text("sender_id").references(()=> participants.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // Type of message (e.g., text, image, file)
    content: text("content").notNull(), // Content of the message
    timestamp: text("timestamp").default(new Date().toISOString()).notNull(), // Timestamp of when the message was sent
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull(), // Timestamp of when the message was last updated
    isEdited: boolean("is_edited").default(false).notNull(), // Whether the message has been edited
    isDeleted: boolean("is_deleted").default(false).notNull(), // Whether the message has been deleted
}) 