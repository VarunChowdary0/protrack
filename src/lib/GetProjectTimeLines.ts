import { db } from "@/db/drizzle";
import { documents } from "@/db/Schema/DoumentSchema";
import { document_submissions } from "@/db/Schema/timeline/DocumentSubmissions";
import { requiredDocuments } from "@/db/Schema/timeline/RequiredDocuments";
import { timeLines } from "@/db/Schema/timeline/TimeLineSchema";
import { Timeline } from "@/types/timelineType";
import { eq, inArray } from "drizzle-orm";

export async function getProjectTimeLines(projectId: string): Promise<Timeline[]>{
    const timelines = await db
          .select()
          .from(timeLines)
          .where(eq(timeLines.projectId, projectId));
    
        const timelineIds = timelines.map(t => t.id);

        const submissions = await db
        .select({
          id: document_submissions.id,
          timelineId: document_submissions.timelineId,
          documentId: document_submissions.documentId,
          submittedBy: document_submissions.submittedBy,
          referenceDocumentId: document_submissions.referenceDocumentId,
          status: document_submissions.status,
          remarks: document_submissions.remarks,
          reviewedAt: document_submissions.reviewedAt,
          reviewedById: document_submissions.reviewedBy,
          createdAt: document_submissions.createdAt,
          updatedAt: document_submissions.updatedAt,
        })
        .from(document_submissions)
        .where(inArray(document_submissions.timelineId, timelineIds));
          
        const reqDocs = await db
          .select({
            id: requiredDocuments.id,
            timelineId: requiredDocuments.timelineId,
            referenceDocumentId: requiredDocuments.referenceDocumentId,
            name: requiredDocuments.name,
            description: requiredDocuments.description,
            createdAt: requiredDocuments.createdAt,
            updatedAt: requiredDocuments.updatedAt,
            referenceDocument: {
              id: documents.id,
              name: documents.name,
              description: documents.description,
              fileType: documents.fileType,
              filePath: documents.filePath,
              createdAt: documents.createdAt,
              updatedAt: documents.updatedAt,
            }
          })
          .from(requiredDocuments)
          .leftJoin(documents, eq(requiredDocuments.referenceDocumentId, documents.id))
          .where(inArray(requiredDocuments.timelineId, timelineIds));
    
        // Map requiredDocuments to their timeline
        const timelineMap = new Map<string, typeof reqDocs>();
    
        for (const doc of reqDocs) {
          if (!timelineMap.has(doc.timelineId)) {
            timelineMap.set(doc.timelineId, []);
          }
          timelineMap.get(doc.timelineId)!.push(doc);
        }

        const submissionMap = new Map<string, typeof submissions>();
        for (const submission of submissions) {
          if (!submissionMap.has(submission.timelineId)) {
            submissionMap.set(submission.timelineId, []);
          }
          submissionMap.get(submission.timelineId)!.push(submission);
        }

    
        // Attach requiredDocuments to corresponding timeline
        const result = timelines.map(t => ({
          ...t,
          requiredDocuments: (timelineMap.get(t.id) || []).map(doc => ({
            ...doc,
            description: doc.description ?? undefined, // convert null to undefined
            referenceDocument: doc.referenceDocument ?? undefined
          })),
        }));


        return result;
}