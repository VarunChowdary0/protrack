import { checkParticipant } from "@/lib/CheckParticipant";
import { getUser } from "@/lib/GetUser";
import { getProjectTimeLines } from "@/lib/GetProjectTimeLines";

export async function GET(request: Request) {
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

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");
    if (!projectId) {
      return new Response(JSON.stringify({ error: "Project ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const check = await checkParticipant(projectId, reqFromUser.user.id);
    if (!check?.isParticipant) {
      return new Response(JSON.stringify({ error: "You are not a participant in this project" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await getProjectTimeLines(projectId);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching project timelines:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch project timelines" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
