import { db } from "@/db/drizzle";
import { documents } from "@/db/Schema/DoumentSchema";
import { document_submissions } from "@/db/Schema/timeline/DocumentSubmissions";
import { requiredDocuments } from "@/db/Schema/timeline/RequiredDocuments";
import { timeLines } from "@/db/Schema/timeline/TimeLineSchema";
import { checkParticipant } from "@/lib/CheckParticipant";
import { getUser } from "@/lib/GetUser";
import { eq} from "drizzle-orm";

export async function GET(request: Request) {
    try{
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];
        const reqFromUser = await getUser(userId);
        if (!reqFromUser?.user?.id) {
            return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        const url = new URL(request.url);
        const timelineId = url.searchParams.get("timelineId");
        if (!timelineId) {
            return new Response(JSON.stringify({ error: "Phase ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        const [currTimeline] = await db.select().from(timeLines).where(eq(timeLines.id, timelineId)).limit(1);
        if (!currTimeline) {
            return new Response(JSON.stringify({ error: "Timeline not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        const checker = await checkParticipant(currTimeline.projectId, reqFromUser.user.id);
        if (!checker.isParticipant || !checker.participantId) {
            return new Response(JSON.stringify({ error: "You are not a participant of this project" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
            });
        }

    
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
          .where(eq(requiredDocuments.timelineId, timelineId));

        const rawSubmittedDocs = await db
        .select({
            id: document_submissions.id,
            timelineId: document_submissions.timelineId,
            documentId: document_submissions.documentId,
            submittedBy: document_submissions.submittedBy,
            status: document_submissions.status,
            createdAt: document_submissions.createdAt,
            updatedAt: document_submissions.updatedAt,
            referenceDocumentId: document_submissions.referenceDocumentId,
            document: {
            id: documents.id,
            name: documents.name,
            description: documents.description,
            fileType: documents.fileType,
            filePath: documents.filePath,
            createdAt: documents.createdAt,
            updatedAt: documents.updatedAt,
            },
        })
        .from(document_submissions)
        .leftJoin(documents, eq(document_submissions.documentId, documents.id))
        .where(eq(document_submissions.timelineId, timelineId));

        const submittedDocs = rawSubmittedDocs.map((submission) => {
        const requiredDoc = reqDocs.find((doc) => doc.id === submission.referenceDocumentId) || null;
        return {
            ...submission,
            requiredDocument: requiredDoc,
        };
        });
   
        
    
        // Attach requiredDocuments to corresponding timeline
        const result = {
            ...currTimeline,
            requiredDocuments: reqDocs,
            documentSubmissions: submittedDocs
        };


        return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
        });


    }
    catch(error) {
        console.error("Error fetching", error);
        return new Response(JSON.stringify({ error: "Failed to fetch" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}