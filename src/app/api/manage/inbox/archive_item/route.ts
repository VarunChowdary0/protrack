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
        const { inboxId, archive } = data;

        if (!inboxId) {
            return new Response(JSON.stringify({ error: "inbox id required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // mark inbox item as seen.
        await db.update(inbox).set({
            isArchived: archive || false, // Set the archive status based on the request
        }).where(and(
            eq(inbox.id, inboxId),
            eq(inbox.userId, userId)
        ));


        return new Response(JSON.stringify({ message: "Inbox item archived successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error in POST /manage/inbox/archive_item:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}