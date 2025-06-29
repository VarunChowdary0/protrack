import { db } from "@/db/drizzle";
import { resources } from "@/db/Schema/project/ResourseSchema";
import { checkParticipant } from "@/lib/CheckParticipant";
import { getUser } from "@/lib/GetUser";
import { uploadFile } from "@/lib/UploadFile";
import { FileType } from "@/types/documentType";
import { Resource } from "@/types/resourceType";

export async function POST(request: Request) {
    try{
        // check for Authorization header
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
        // check if the user is part of the project
        // add the new resource to the project
        const form = await request.formData();
        const projectId = form.get("projectId") as string;
        const name = form.get("name") as string;
        const description = form.get("description") as string;
        const fileType = form.get("fileType") as FileType;
        const file = form.get("file") as File;

        console.log({
            projectId,
            name,
            description,
            fileType,
            file,
            userId: reqFromUser.user.id
        })

        if (!projectId || !name || !description || !fileType || !file || !(file instanceof File)) {
        return new Response(JSON.stringify({ error: "All fields are required including a valid file." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
        }


        const checker = await checkParticipant(projectId, reqFromUser.user.id);
        if(!checker.isParticipant || !checker.participantId) {
            return new Response(JSON.stringify({ error: "You are not a participant of this project" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }
        else{
            const newDoc = await uploadFile({
                name:name,
                description:description,
                fileType:fileType,
                file:file,
            });

            const [newResurce] = await db.insert(resources).values({
                id: crypto.randomUUID(),
                projectId: projectId,
                ownerId: checker.participantId,
                documentId: newDoc.id,
            }).returning();

            if (!newResurce) {
                console.error("DB insert failed:", { projectId, name, description });
                return new Response(JSON.stringify({ error: "Failed to add resource" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const result: Resource = {
                id: newResurce.id,
                projectId: newResurce.projectId,
                ownerId: newResurce.ownerId,
                documentId: newResurce.documentId,
                createdAt: newResurce.createdAt,
                updatedAt: newResurce.updatedAt,
                document: newDoc,
            };

            return new Response(JSON.stringify(result), {
                status: 200,
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