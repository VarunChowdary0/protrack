// File: app/src/app/api/project/manage/phase/submit-docs/route.ts

import { db } from "@/db/drizzle";
import { document_submissions } from "@/db/Schema/timeline/DocumentSubmissions";
import { timeLines } from "@/db/Schema/timeline/TimeLineSchema";
import { checkParticipant } from "@/lib/CheckParticipant";
import { getUser } from "@/lib/GetUser";
import { uploadFile } from "@/lib/UploadFile";
import { FileType } from "@/types/documentType";
import { DocSubmissionStatus, DocumentSubmission } from "@/types/timelineType";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
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

    const form = await request.formData();
    const submittedBy = reqFromUser.user.id;
    const timelineId = form.get("timelineId") as string;
    const referenceDocumentId = form.get("referenceDocumentId") as string;
    const fileType = form.get("fileType") as FileType;
    const file = form.get("file") as File;

    if (!timelineId || !fileType || !(file instanceof File) || !referenceDocumentId || !submittedBy) {
      return new Response(JSON.stringify({ error: "All fields including file are required." }), {
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

    const checker = await checkParticipant(currTimeline.projectId, submittedBy);
    if (!checker.isParticipant || !checker.participantId) {
      return new Response(JSON.stringify({ error: "You are not a participant of this project" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newDoc = await uploadFile({
      name: file.name || "Document",
      description: "Document submission",
      fileType: fileType,
      file: file,
    });

    if (!newDoc) {
      return new Response(JSON.stringify({ error: "File upload failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if submission already exists
    const [existing] = await db
      .select()
      .from(document_submissions)
      .where(and(
        eq(document_submissions.submittedBy, checker.participantId),
        eq(document_submissions.referenceDocumentId, referenceDocumentId)
      ))
      .limit(1);

    let result: DocumentSubmission;

    if (existing) {
      // Overwrite: update the existing submission with new document
      const [updated] = await db.update(document_submissions)
        .set({
          documentId: newDoc.id,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(document_submissions.id, existing.id))
        .returning();

      result = {
        id: updated.id,
        timelineId: updated.timelineId,
        submittedBy: updated.submittedBy,
        referenceDocumentId: updated.referenceDocumentId,
        documentId: updated.documentId,
        remarks: updated.remarks || "",
        reviewedAt: updated.reviewedAt || "",
        reviewedById: updated.reviewedBy || "",
        status: updated.status || DocSubmissionStatus.PENDING,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        document: {
          id: newDoc.id,
          name: newDoc.name,
          description: newDoc.description,
          fileType: newDoc.fileType,
          filePath: newDoc.filePath,
          createdAt: newDoc.createdAt,
          updatedAt: newDoc.updatedAt,
        },
      };
    } else {
      // Insert new submission
      const [inserted] = await db.insert(document_submissions).values({
        id: crypto.randomUUID(),
        timelineId: timelineId,
        submittedBy: checker.participantId,
        referenceDocumentId: referenceDocumentId,
        documentId: newDoc.id,
      }).returning();

      result = {
        id: inserted.id,
        timelineId: inserted.timelineId,
        submittedBy: inserted.submittedBy,
        referenceDocumentId: inserted.referenceDocumentId,
        documentId: inserted.documentId,
        remarks: inserted.remarks || "",
        reviewedAt: inserted.reviewedAt || "",
        reviewedById: inserted.reviewedBy || "",
        status: inserted.status,
        createdAt: inserted.createdAt,
        updatedAt: inserted.updatedAt,
        document: {
          id: newDoc.id,
          name: newDoc.name,
          description: newDoc.description,
          fileType: newDoc.fileType,
          filePath: newDoc.filePath,
          createdAt: newDoc.createdAt,
          updatedAt: newDoc.updatedAt,
        },
      };
    }
    const statusCode = existing ? 200 : 201;

    return new Response(JSON.stringify(result), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in submit-docs route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
