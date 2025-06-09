import { db } from "@/db/drizzle";
import { users } from "@/db/Schema/UserSchema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try{
        const url = new URL(req.url);
        const orgId = url.searchParams.get("orgId");

        if (!orgId) {
            return new Response(JSON.stringify({ error: "Organization ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }   

        const OrgUsers = await db.select().from(users).where(eq(users.organizationId, orgId));

        if (OrgUsers.length === 0) {
            return new Response(JSON.stringify({ error: "No users found for this organization" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(OrgUsers), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error in GET /org/users:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}