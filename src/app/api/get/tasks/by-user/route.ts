import { db } from "@/db/drizzle";
import { tasks } from "@/db/Schema/project/TaskSchema";
import { getUser } from "@/lib/GetUser";
import { and, eq, or } from "drizzle-orm";

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

        const url = new URL(req.url);
        const projectId = url.searchParams.get("projectId");
        const participantId = url.searchParams.get("participantId");

        if (!projectId) {
            return new Response(JSON.stringify({ error: "Project ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!reqFromUser.user.id || !participantId) {
            return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const myTasks = await db.select().from(tasks).where
        (
            and(
                eq(tasks.projectId, projectId),
                or
                    (
                        eq(tasks.assignedTo_id,participantId),
                        eq(tasks.assignedBy_id,participantId)
                    )
            )
        );
        return new Response(JSON.stringify(myTasks), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch(error){
        console.error("Error fetching participants:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch participants" }), { status: 500 });
    }
}