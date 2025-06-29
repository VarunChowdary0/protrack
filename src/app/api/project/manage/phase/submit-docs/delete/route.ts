// file: app/src/app/api/project/manage/phase/submit-docs/delete/route.ts

import { db } from "@/db/drizzle";
import { document_submissions } from "@/db/Schema/timeline/DocumentSubmissions";
import { getUser } from "@/lib/GetUser";
import { DocSubmissionStatus } from "@/types/timelineType";
import { and, eq } from "drizzle-orm";

export async function DELETE(request: Request) {
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
        const refDocumentId = url.searchParams.get("refDocumentId");
        if (!timelineId || !refDocumentId) {
            return new Response(JSON.stringify({ error: "Timeline ID and Document ID are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const deleted = await db.delete(document_submissions).where(
            and(
                eq(document_submissions.referenceDocumentId, refDocumentId),
                eq(document_submissions.timelineId, timelineId),
                eq(document_submissions.submittedBy, reqFromUser.user.id),
                eq(document_submissions.status,DocSubmissionStatus.PENDING)
            )
        ).returning();
        if (deleted.length === 0) {
            return new Response(JSON.stringify({ error: "No pending submission found to delete" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(JSON.stringify({ message: "Required document deleted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch (error) {
        console.error("Error deleting required document:", error);
        return new Response(JSON.stringify({ error: "Failed to delete required document" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}