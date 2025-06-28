import { db } from "@/db/drizzle";
import { invitations } from "@/db/Schema/InvitationSchema";
import { getUser } from "@/lib/GetUser";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try{
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

        const url = new URL(req.url);
        const projectId = url.searchParams.get("projectId");
        if (!projectId) {
            return new Response(JSON.stringify({ error: "Project ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Fetch invitations for the project
        const invs = await db.select()
            .from(invitations)
            .where(
                eq(invitations.projectId, projectId)
            );
        
        return new Response(JSON.stringify(invs), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
            
    }
    catch (error) {
        console.error("Error fetching invitations:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch invitations" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}