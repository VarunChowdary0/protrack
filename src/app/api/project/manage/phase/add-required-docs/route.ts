// File: app/src/app/api/project/manage/phase/add-required-docs/route.ts
import { db } from "@/db/drizzle";
import { requiredDocuments } from "@/db/Schema/timeline/RequiredDocuments";
import { timeLines } from "@/db/Schema/timeline/TimeLineSchema";
import { getBasicPrj } from "@/lib/GetBasicPrj";
import { getUser } from "@/lib/GetUser";
import { uploadFile } from "@/lib/UploadFile";
import { FileType } from "@/types/documentType";
import { RequiredDocument } from "@/types/timelineType";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
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
        if (!reqFromUser || !reqFromUser.user || !reqFromUser.user.id) {
            return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const form = await request.formData();
        const timelineId = form.get("timelineId") as string;
        const name = form.get("name") as string;
        const description = form.get("description") as string;
        const fileType = form.get("fileType") as FileType;
        const file = form.get("file") as File;
        
        if (!timelineId || !name || !description || !fileType || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: "All fields including file are required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }


        const timeLine = await db.select().from(timeLines).where(eq(timeLines.id, timelineId)).limit(1);
        if (!timeLine || timeLine.length === 0) {
            return new Response(JSON.stringify({ error: "Timeline not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        const { projectId } = timeLine[0];
        // 3. Check project ownership
        const projectBasic = await getBasicPrj(projectId);
        if (!projectBasic) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
            });
        }

        if (projectBasic.creator_id === reqFromUser.user.id) {
            // add required documents to the phase
            const newDoc = await uploadFile({
                name:name,
                description:description,
                fileType:fileType,
                file:file,
            });



            const newReqDoc = await db.insert(requiredDocuments).values({
                id: crypto.randomUUID(),
                timelineId: timelineId,
                referenceDocumentId: newDoc.id,
                name: name,
                description: description,
            }).returning();

            if(!newReqDoc || newReqDoc.length === 0) {
                return new Response(JSON.stringify({ error: "Failed to add required document" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const result:RequiredDocument = {
                id: newReqDoc[0].id,
                timelineId: newReqDoc[0].timelineId,
                referenceDocumentId: newReqDoc[0].referenceDocumentId,
                description: newReqDoc[0].description || "",
                name: newReqDoc[0].name,
                createdAt: newReqDoc[0].createdAt,
                updatedAt: newReqDoc[0].updatedAt,
                referenceDocument: {
                    id: newDoc.id,
                    name: newDoc.name,
                    description: newDoc.description || "",
                    fileType: newDoc.fileType,
                    filePath: newDoc.filePath,
                    createdAt: newDoc.createdAt,
                    updatedAt: newDoc.updatedAt,
                }
            }

            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
        else{
            return new Response(JSON.stringify({ error: "You are not authorized to add required documents to this phase" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }
        
    }
    catch (error) {
        console.error("Error in POST request:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}