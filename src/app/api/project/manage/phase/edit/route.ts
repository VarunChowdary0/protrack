// File: app/src/app/api/project/manage/phase/edit/route.ts

import { db } from "@/db/drizzle";
import { timeLines } from "@/db/Schema/timeline/TimeLineSchema";
import { getBasicPrj } from "@/lib/GetBasicPrj";
import { getUser } from "@/lib/GetUser";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    // 1. Check Authorization header
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

    // 2. Parse request body
    const body = await request.json();
    const {
      projectId,
      phaseId,
      title,
      description,
      startDate,
      endDate,
      verifiedDocuments,
      totalDocuments,
      status,
      remarks,
    } = body;

    if (!projectId || !phaseId) {
      return new Response(JSON.stringify({ error: "Project ID and Phase ID are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Check project ownership
    const projectBasic = await getBasicPrj(projectId);
    if (!projectBasic) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (projectBasic.creator_id !== reqFromUser.user.id) {
      return new Response(JSON.stringify({ error: "You are not authorized to edit this phase" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Update the timeline phase
    const [updatedPhase] = await db
      .update(timeLines)
      .set({
        title,
        description,
        startDate,
        endDate,
        verifiedDocuments,
        totalDocuments,
        status,
        remarks,
        updatedAt: new Date().toISOString(), // Optional: update timestamp
      })
      .where(eq(timeLines.id, phaseId))
      .returning();

    if (!updatedPhase) {
      return new Response(JSON.stringify({ error: "Phase not found or update failed" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedPhase), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
