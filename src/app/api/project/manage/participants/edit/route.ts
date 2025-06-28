import { db } from "@/db/drizzle";
import { participants } from "@/db/Schema/ParticipantSchema";
import { getUser } from "@/lib/GetUser";
import send_Notification from "@/lib/SendNotification";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {

        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];
        // Here you would typically fetch the user from your database
        const reqFromUser = await getUser(userId);
        if (!reqFromUser.user.id) {
            return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        if (!reqFromUser.user.access?.createProjects && !reqFromUser.user.access?.deleteProjects) {
            return new Response(JSON.stringify({ error: "Access denied" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await req.json();
        const { 
            id,
            isLead,
            isTeamMember,
            role,
            isActive
         } = data;

         console.log(data)
        if (!id) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const retu = await db.update(participants).set({
            isLead: isLead ,
            isTeamMember: isTeamMember ,
            role: role ,
            isActive: isActive,
        }).where(eq(id,participants.id)).returning();

        if (retu.length === 0) {
            return new Response(JSON.stringify({ error: "Participant not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        send_Notification({
            userIds: [retu[0].userId],
            title: "Role Update",
            body: `Your project role has been updated to ${role}${isLead ? ' (Project Lead)' : ''}`,
            data: {
            type: 'PARTICIPANT_UPDATE',
            participantId: retu[0].id,
            projectId: retu[0].projectId,
            url: `/${retu[0].projectId}/dashboard`,
            }
        })

        return new Response(JSON.stringify(retu[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
        

    } catch (error) {
        console.error("Error in POST /api/project/manage/participants/edit:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}