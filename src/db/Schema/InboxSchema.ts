import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { participants } from "./ParticipantSchema";
import { users } from "./UserSchema";
import { projects } from "./ProjectSchema";

export const inbox = pgTable("inbox", {
    id: text("id").primaryKey(),
    fromId: text("from_id").references(() => participants.id, { onDelete: 'cascade' }),
    participantId: text("participant_id").references(() => participants.id, { onDelete: 'cascade' }),
    userId: text("user_id").references(() => users.id, { onDelete: 'cascade' }), 
    projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: text("type").notNull(), // Type of inbox item (e.g., message, notification)
    seenAt: text("seen_at").default(""),
    isArchived: boolean("is_archived").default(false).notNull(), // Whether the inbox item is archived
    isDeleted: boolean("is_deleted").default(false).notNull(), // Whether the inbox item is deleted
    isStarred: boolean("is_starred").default(false).notNull(), // Whether the inbox item is starred 
    timestamp: text("created_at").default(new Date().toISOString()).notNull(),
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull(),
})