import { db } from "@/db/drizzle";
import { tasks } from "@/db/Schema/project/TaskSchema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/GetUser";

export async function PUT(request: Request) {
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
    if (!reqFromUser || !reqFromUser.user?.id) {
      return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const {
      id,
      title,
      description,
      dueDate,
      assignedTo_id,
      isPlanned,
      isImportant,
      status,
      updatedAt,
      priority,
    } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Task ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await db
      .update(tasks)
      .set({
        title,
        description,
        dueDate,
        assignedTo_id,
        isPlanned,
        isImportant,
        status,
        updatedAt,
        priority,
      })
      .where(eq(tasks.id, id))
      .returning();

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in PUT /manage/tasks/update:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
