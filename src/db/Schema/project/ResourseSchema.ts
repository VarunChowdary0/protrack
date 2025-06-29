import {text , pgTable} from "drizzle-orm/pg-core";
import { projects } from "./ProjectSchema";
import { sql } from "drizzle-orm";
import { documents } from "../DoumentSchema";
import { participants } from "../ParticipantSchema";

export const resources = pgTable("resources", {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(()=> projects.id, { onDelete:"cascade"}).notNull(), 
    ownerId: text("owner_id").references(() => participants.id, { onDelete: "cascade" }).notNull(), // Foreign key to the owner of the resource
    documentId: text("document_id").references(() => documents.id, { onDelete: "cascade" }).notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})