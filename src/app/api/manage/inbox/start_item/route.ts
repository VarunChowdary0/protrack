import { db } from "@/db/drizzle";
import { inbox } from "@/db/Schema/InboxSchema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
    try{
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];
        const data = await req.json();
        const { inboxId, star } = data;

        if (!inboxId) {
            return new Response(JSON.stringify({ error: "inbox id required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // mark inbox item as seen.
        await db.update(inbox).set({
            seenAt: new Date().toISOString(),
            isStarred: star || false, // Set the star status based on the request
        }).where(and(
            eq(inbox.id, inboxId),
            eq(inbox.userId, userId)
        ));

        // Here you can add any additional logic needed to start the item
        // For example, updating the status of the item or notifying other services

        return new Response(JSON.stringify({ message: "Inbox item started successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error in POST /manage/inbox/start_item:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}