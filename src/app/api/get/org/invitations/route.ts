import { db } from "@/db/drizzle";
import { invitations } from "@/db/Schema/InvitationSchema";
import { getUser } from "@/lib/GetUser";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        // authenticate
        const authHeader = req.headers.get("Authorization");
        if(!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];

        // -- user check
        const reqFromUser = await getUser(userId);
        if(!reqFromUser.user.id){
            return new Response(JSON.stringify({ error: "User not found",
                action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        // -- permission check
        if(!reqFromUser.user.access?.manageOrganization) {
            return new Response(JSON.stringify({ error: "Unauthorized access to organization" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        //-----
        const orgId = url.searchParams.get("orgId");
        if (!orgId) {
            return new Response(JSON.stringify({ error: "Organization ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Fetch users by organization ID from the database
        console.log(orgId)
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