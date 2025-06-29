import { pgTable, text } from "drizzle-orm/pg-core";
import { timeLines } from "./TimeLineSchema";
import { sql } from "drizzle-orm";
import { documents } from "../DoumentSchema";

export const requiredDocuments = pgTable("requiredDocuments", {
    id: text("id").primaryKey(),
    timelineId: text("timeline_id").references(() => timeLines.id, { onDelete: "cascade" }).notNull(),
    referenceDocumentId: text("reference_document_id")
                .references(()=> 
                    documents.id, { onDelete: "cascade" })
                .notNull(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});