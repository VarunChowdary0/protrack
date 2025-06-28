import { db } from "@/db/drizzle";
import { projects } from "@/db/Schema/ProjectSchema";
import { addParticipant } from "@/lib/AddParticipant";
import { getBasicPrj } from "@/lib/GetBasicPrj";
import { getUser } from "@/lib/GetUser";
import send_Notification from "@/lib/SendNotification";
import { ParticipantRole } from "@/types/participantType";
import { eq } from "drizzle-orm";

export async function POST(req:Request) {
    try{
        const data = await req.json();

        const {
            projectId,
            new_userId,
            isLead,
            isTeamMember,
            role,
        } = data;

        if(!projectId) {
            return new Response(JSON.stringify({ error: "Project ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        if (!new_userId) {
            return new Response(JSON.stringify({ error: "User ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];
        const reqFromUser = await getUser(userId);


        if (!reqFromUser.user.id) {
            return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        if(!reqFromUser.user.access?.createProjects){
            return new Response(JSON.stringify({ error: "Access denied" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }
        const proj = await getBasicPrj(projectId);
        if (!proj) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        if(proj.creator_id !== reqFromUser.user.id ) {
            return new Response(JSON.stringify({ error: "You are not authorized to add participants to this project" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        const organizationId = reqFromUser.user.organizationId;

        const targetUser = await getUser(new_userId);
        if (!targetUser.user || targetUser.user.organizationId !== organizationId) {
            return new Response(JSON.stringify({ error: "Target user not found or not in same organization" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }


        if(organizationId === "1"){
            return new Response(JSON.stringify({ error: "Access denied for this organization" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        const status = await addParticipant({
                            userId: new_userId,
                            projectId: projectId,
                            isLead: isLead ?? false,
                            isTeamMember: isTeamMember ?? true,
                            role: role ?? ParticipantRole.CUSTOM
                        });


        if(!status.success) {
            if(status.message === "Participant already exists"){
                return new Response(JSON.stringify({ message: status.message, participant: status.participant }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }
            return new Response(JSON.stringify({ error: status.message }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const [prj] = await db.select()
            .from(projects)
            .where(eq(projects.id, projectId));

        const nofiPayload = {
            userIds: [new_userId],
            title: prj.name || "Project Invitation",
            body: `You have been added to the project by
             ${reqFromUser.user.firstname + " " +reqFromUser.user.lastname} 
             as a ${role}.`,
            icon: "/favicon.ico",
            image: reqFromUser.user.profilePicture,
            url: `${projectId}/dashboard`,
            renotify: true,
        }
        send_Notification(nofiPayload);

        return new Response(JSON.stringify({ message: "Participant added successfully", participant: status.participant }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
        

    }
    catch(error){
        console.error("Error fetching participants:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch participants" }), { status: 500 });
    }
}