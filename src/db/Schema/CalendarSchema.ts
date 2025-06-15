import { pgTable, text } from "drizzle-orm/pg-core"
import { participants } from "./ParticipantSchema";
import { projects } from "./ProjectSchema";
import { sql } from "drizzle-orm";

export const calendar = pgTable("calendar", {
    id: text("id").primaryKey(),
    participantId: text("participant_id").references(() => participants.id, { onDelete: 'cascade' }),
    projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }),
    date: text("date").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});