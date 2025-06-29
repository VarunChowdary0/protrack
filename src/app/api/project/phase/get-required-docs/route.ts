import { db } from "@/db/drizzle";
import { documents } from "@/db/Schema/DoumentSchema";
import { requiredDocuments } from "@/db/Schema/timeline/RequiredDocuments";
import { timeLines } from "@/db/Schema/timeline/TimeLineSchema";
import { checkParticipant } from "@/lib/CheckParticipant";
import { getUser } from "@/lib/GetUser";
import { eq } from "drizzle-orm";

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

        return new Response(JSON.stringify(reqDocs), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch(error) {
        console.error("Error fetching required documents:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch required documents" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}