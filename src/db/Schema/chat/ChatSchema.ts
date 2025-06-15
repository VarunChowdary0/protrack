import { pgTable, text } from "drizzle-orm/pg-core";
import { participants } from "../ParticipantSchema";
import { sql } from "drizzle-orm";
import { projects } from "../ProjectSchema";

export const chats = pgTable("chats", {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }), // Reference to the project
    userID_1: text("user_id_1").references(()=> participants.id, { onDelete: "cascade"}), // ID of the first user in the chat
    userID_2: text("user_id_2").references(()=> participants.id, { onDelete: "cascade"}), // ID of the second user in the chat
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});