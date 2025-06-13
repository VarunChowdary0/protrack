import { NextRequest, NextResponse } from "next/server";
import send_Notification from "@/lib/SendNotification";


export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { userIds } = payload;

    if (!userIds) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const x = await send_Notification(payload)
    return NextResponse.json({ success: x });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Push failed" }, { status: 500 });
  }
}
