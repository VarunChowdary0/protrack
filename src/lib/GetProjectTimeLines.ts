import { db } from "@/db/drizzle";
import { documents } from "@/db/Schema/DoumentSchema";
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
    
        // Attach requiredDocuments to corresponding timeline
        const result = timelines.map(t => ({
          ...t,
          requiredDocuments: timelineMap.get(t.id) || [],
        }));

        return result;
}