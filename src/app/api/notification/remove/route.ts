// app/api/notifications/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { notifications } from "@/db/Schema/NotificationSchema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("USER_ID ")) {
        return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    const userId = authHeader.split(" ")[1];
    
    if (!userId) {
        return new Response(JSON.stringify({ error: "User ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const body = await req.json();
    await db.delete(notifications).where(
    and(
        eq(notifications.userId, body.userId),
        eq(notifications.endpoint, body.endpoint)
    )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove notification" },
      { status: 500 }
    );
  }
}
