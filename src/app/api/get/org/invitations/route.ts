import { db } from "@/db/drizzle";
import { invitations } from "@/db/Schema/InvitationSchema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const orgId = url.searchParams.get("orgId");

        if (!orgId) {
            return new Response(JSON.stringify({ error: "Organization ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Fetch users by organization ID from the database
        const users = await db.select().from(invitations).where(eq(invitations.org_id, orgId));

        if (users.length === 0) {
            return new Response(JSON.stringify({ error: "No invitations found  in organization" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in GET /org/users:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}