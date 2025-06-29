import { db } from "@/db/drizzle";
import { timeLines } from "@/db/Schema/timeline/TimeLineSchema";
import { getBasicPrj } from "@/lib/GetBasicPrj";
import { getUser } from "@/lib/GetUser";
import { notifyParticipants } from "@/lib/Notify_Participants";
import { TimelineEventType } from "@/types/timelineType";

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

        const body = await request.json();
        const {
            projectId,
            title,
            description,
            startDate,
            endDate,
            verifiedDocuments = 0,
            totalDocuments = 0, // when adding documents increment based on count
            status = TimelineEventType.PENDING,
            remarks,
        } = body;

        if (!startDate || !endDate || isNaN(verifiedDocuments) || isNaN(totalDocuments)) {
            return new Response(JSON.stringify({ error: "Invalid or missing input fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const projectDetails = await getBasicPrj(projectId);
        if (!projectDetails) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        if(projectDetails.creator_id === reqFromUser.user.id){
            const newPhase = await db.insert(timeLines).values({
                id: crypto.randomUUID(),
                projectId: projectId,
                title: title,
                description: description,
                startDate: startDate,
                endDate: endDate,
                verifiedDocuments: verifiedDocuments,
                totalDocuments: totalDocuments,
                status: status,
                remarks: remarks  
            }).returning();
            
            await notifyParticipants(projectId, {
                title: projectDetails.name || newPhase[0].title,
                body: `A new phase "${title}" has been added to the project.`,
                url: `/${projectDetails.id}/dashboard`,
                icon: "/favicon.ico",
                image: "/placeholder.png",
                data: {
                    type: "timeline",
                    title: newPhase[0].title,
                    description: newPhase[0].description,
                    startDate: newPhase[0].startDate,
                    endDate: newPhase[0].endDate,
                    verifiedDocuments: newPhase[0].verifiedDocuments,
                    totalDocuments: newPhase[0].totalDocuments,
                    status: newPhase[0].status,
                    remarks: newPhase[0].remarks,
                    projectId: projectId
                },
                renotify: true,
            })
        }
        else{
            return new Response(JSON.stringify({ error: "You are not the creator of this project" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }


    }
    catch (error) {
        console.error("Error in POST /api/project/add/phase:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}