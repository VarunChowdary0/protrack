// app/api/notifications/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { notifications } from "@/db/Schema/NotificationSchema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    console.log('=== Remove Notification Request ===');
    
    const authHeader = req.headers.get("Authorization");
    // console.log('Authorization header:', authHeader);
    
    if(!authHeader || !authHeader.startsWith("USER_ID ")) {
        // console.log('Missing or invalid Authorization header');
        return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const userId = authHeader.split(" ")[1];
    // console.log('Extracted userId:', userId);
    
    if (!userId) {
        console.log('User ID is empty');
        return new Response(JSON.stringify({ error: "User ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { endpoint } = body;
    
    if (!endpoint) {
        console.log('Endpoint is missing from request body');
        return new Response(JSON.stringify({ error: "Endpoint is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    // console.log('About to delete notification with:');
    // console.log('- userId:', userId);
    // console.log('- endpoint:', endpoint);
    
    // First, let's check if the record exists before deleting
    const existingNotifications = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.endpoint, endpoint)
        )
      );
    
    // console.log('Found existing notifications:', existingNotifications.length);
    // console.log('Existing notifications data:', existingNotifications);
    
    if (existingNotifications.length === 0) {
      console.log('No matching notification found to delete');
      return NextResponse.json({ 
        success: false, 
        message: "No matching notification subscription found",
        debug: {
          userId,
          endpoint,
          searchedFor: { userId, endpoint }
        }
      }, { status: 404 });
    }
    
    // Proceed with deletion
    const result = await db.delete(notifications).where(
        and(
            eq(notifications.userId, userId),
            eq(notifications.endpoint, endpoint)
        )
    );
    
    console.log('Delete operation result:', result);
    
    // Verify deletion by checking if record still exists
    const remainingNotifications = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.endpoint, endpoint)
        )
      );
    
    // console.log('Remaining notifications after deletion:', remainingNotifications.length);
    
    return NextResponse.json({ 
        success: true, 
        message: "Notification subscription removed successfully",
        debug: {
          deletedCount: existingNotifications.length,
          remainingCount: remainingNotifications.length
        }
    });
    
  } catch (error) {
    // console.error('Remove notification error:', error);
    return NextResponse.json(
      { 
        error: "Failed to remove notification",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}