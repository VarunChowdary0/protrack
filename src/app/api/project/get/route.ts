import { getProject } from "@/lib/GetProject";
import { getUser } from "@/lib/GetUser";

export async function GET(req: Request) {
    try {
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
        
        const prj = await getProject(projectId);
        
        if (!prj) {
            return new Response(JSON.stringify({ error: "Project not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check if user is a participant
        const isParticipant = prj.participants?.some((participant) => 
            participant.userId === userId
        );

        if (isParticipant) {
            return new Response(JSON.stringify(prj), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            return new Response(JSON.stringify({ error: "You are not a participant of this project" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

    } catch (error) {
        console.error("Error fetching participants:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch participants" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}