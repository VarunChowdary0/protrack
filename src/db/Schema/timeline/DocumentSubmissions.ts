import { pgTable, text, unique } from "drizzle-orm/pg-core";
import { timeLines } from "./TimeLineSchema";
import { documents } from "../DoumentSchema";
import { participants } from "../ParticipantSchema";
import { sql } from "drizzle-orm";
import { requiredDocuments } from "./RequiredDocuments";
import { DocSubmissionStatus } from "@/types/timelineType";

export const document_submissions = pgTable(
  "document_submissions",
  {
    id: text("id").primaryKey(),
    timelineId: text("timeline_id").references(() => timeLines.id, { onDelete: "cascade" }).notNull(),
    submittedBy: text("submitted_by").references(() => participants.id, { onDelete: "cascade" }).notNull(),
    referenceDocumentId: text("reference_document_id")
      .references(() => requiredDocuments.id, { onDelete: "cascade" }).notNull(),
    documentId: text("document_id")
      .references(() => documents.id, { onDelete: "cascade" })
      .notNull(),
    remarks: text("remarks"),
    status: text("status").$type<DocSubmissionStatus>().default(DocSubmissionStatus.PENDING).notNull(),
    reviewedAt: text("reviewed_at"),
    reviewedBy: text("reviewed_by").references(() => participants.id, { onDelete: "set null" }),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    uniqueSubmission: unique("unique_submission").on(table.submittedBy, table.referenceDocumentId),
  })
);