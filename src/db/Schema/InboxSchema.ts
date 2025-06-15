import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./UserSchema";
import { InboxItemType } from "@/types/inboxType";
import { sql } from "drizzle-orm";

export const inbox = pgTable("inbox", {
    id: text("id").primaryKey(),
    fromId: text("from_id").references(() => users.id, { onDelete: 'cascade' }),
    participantId: text("participant_id").default(""), //.references(() => participants.id, { onDelete: 'cascade' }),
    userId: text("user_id").references(() => users.id, { onDelete: 'cascade' }), 
    projectId: text("project_id").default(""), //references(() => projects.id, { onDelete: 'cascade' }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: text("type").$type<InboxItemType>().default(InboxItemType.MESSAGE), 
    
    // type == invite
    inviteId: text("invite_id").default(""), //references(() => invitations.id, { onDelete: 'cascade' }).default(""),
    // type == task
    taskId: text("task_id").default(""), // Optional task 
    // type == notification
    calendarId: text("calendar_id").default(""), // Optional calendar

    seenAt: text("seen_at").default(""),
    isArchived: boolean("is_archived").default(false).notNull(), // Whether the inbox item is archived
    isDeleted: boolean("is_deleted").default(false).notNull(), // Whether the inbox item is deleted
    isStarred: boolean("is_starred").default(false).notNull(), // Whether the inbox item is starred 
    timestamp: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),

})