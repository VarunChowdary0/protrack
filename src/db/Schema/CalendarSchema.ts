import { pgTable, text } from "drizzle-orm/pg-core"
import { participants } from "./ParticipantSchema";
import { projects } from "./ProjectSchema";

export const calendar = pgTable("calendar", {
    id: text("id").primaryKey(),
    participantId: text("participant_id").references(() => participants.id, { onDelete: 'cascade' }),
    projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }),
    date: text("date").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    createdAt: text("created_at").default(new Date().toISOString()).notNull(),
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull(),
});