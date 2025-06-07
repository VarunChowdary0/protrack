import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { group } from "./GroupSchema";
import { participants } from "../ParticipantSchema";

export const groupMemberSchema = pgTable("group_member", {
    id: text("id").primaryKey(),
    groupId: text("group_id").references(() => group.id, { onDelete: "cascade" }), // ID of the group
    userId: text("user_id").references(() => participants.id, { onDelete: "cascade" }), // ID of the user
    isAdmin: boolean("is_admin").default(false).notNull(), // Whether the user is an admin of the group
    joinedAt: text("joined_at").default(new Date().toISOString()).notNull(), // Timestamp of when the user joined the group
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull(), // Timestamp of when the membership was last updated
})