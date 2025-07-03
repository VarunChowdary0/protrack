// file: app/src/app/api/project/manage/phase/submit-docs/review/route.ts

// evaluate [approve/reject],update reviewedAt,reviewedBy, add Remarks document submission

import { db } from "@/db/drizzle";
import { document_submissions } from "@/db/Schema/timeline/DocumentSubmissions";
import { timeLines } from "@/db/Schema/timeline/TimeLineSchema";
import { getBasicPrj } from "@/lib/GetBasicPrj";
import { getUser } from "@/lib/GetUser";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try{
        // only creator can review the document submission
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
        const body = await request.json();
        const {
            documentSubmissionId,
            reviewedBy,
            status,
            remarks,
        } = body;

        const submissionWithTimeline = await db.select()
            .from(timeLines)
            .leftJoin(document_submissions, eq(timeLines.id, document_submissions.timelineId))
            .where(eq(document_submissions.id, documentSubmissionId))
            .limit(1);
        if (!submissionWithTimeline || submissionWithTimeline.length === 0) {
            return new Response(JSON.stringify({ error: "Document submission not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }  
        const projectId = submissionWithTimeline[0].time_lines.projectId;

        const projectBasic = await getBasicPrj(projectId);
        if(projectBasic?.creator_id !== reqFromUser.user.id) {
            return new Response(JSON.stringify({ error: "You are not authorized to review this document submission" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        const updated = await db.update(document_submissions).set({
            remarks: remarks !== undefined ? remarks : submissionWithTimeline[0].document_submissions?.remarks,
            status: status !== undefined ? status : submissionWithTimeline[0].document_submissions?.status,
            reviewedAt: new Date().toISOString(),
            reviewedBy: reviewedBy,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(document_submissions.id, documentSubmissionId))
        .returning();
        
        if (updated.length === 0) {
            return new Response(JSON.stringify({ error: "Failed to update document submission" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({
            message: "Document submission reviewed successfully",
            data: updated[0],
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch (error) {
        console.error("Error in POST request:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}