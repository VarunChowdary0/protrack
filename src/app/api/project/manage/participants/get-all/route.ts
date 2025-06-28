import { db } from "@/db/drizzle";
import { participants } from "@/db/Schema/ParticipantSchema";
import { users } from "@/db/Schema/UserSchema";
import { getUser } from "@/lib/GetUser";
import { eq } from "drizzle-orm";

export async function GET(req:Request) {
    try{
        const url = new URL(req.url);
        const projectId = url.searchParams.get("projectId");

        if(!projectId) {
            return new Response(JSON.stringify({ error: "Project ID is required" }), {
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

        const organizationId = reqFromUser.user.organizationId;

        if(organizationId === "1"){
            return new Response(JSON.stringify({ error: "Access denied for this organization" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        const prj_participants = await db.select({
            id: participants.id,
            projectId: participants.projectId,
            userId: participants.userId,
            role: participants.role,
            isLead: participants.isLead,
            isTeamMember: participants.isTeamMember,
            isActive: participants.isActive,
            user: {
            id: users.id,
            firstName: users.firstname,
            lastName: users.lastname,
            email: users.email,
            profilePicture: users.profilePicture
            }
        })
        .from(participants)
        .leftJoin(users, eq(participants.userId, users.id))
        .where(eq(participants.projectId, projectId));

        console.log(`Fetched participants for project ID: ${projectId}`, prj_participants);

        return new Response(JSON.stringify(prj_participants), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch(error){
        console.error("Error fetching participants:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch participants" }), { status: 500 });
    }
}