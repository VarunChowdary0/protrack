import { db } from "@/db/drizzle";
import { users } from "@/db/Schema/UserSchema";
import { getUser } from "@/lib/GetUser";
import { UserRole } from "@/types/userTypes";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try{
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
        const reqFromUser = await getUser(userId);
        // -- user check
        if(!reqFromUser.user.id){
            return new Response(JSON.stringify({ error: "User not found",
             action: "LOGOUT" }), {
                 status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }


        // -- permission check
        // console.log(reqFromUser)
        console.log("User access:", reqFromUser.user.access?.accessOrganizationUsers , reqFromUser.user.role, reqFromUser.user.access?.userRole);
        if(!reqFromUser.user.access?.accessOrganizationUsers) {
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

        if(reqFromUser.user.organizationId !== orgId && reqFromUser.user.role !== UserRole.ADMIN) {
            return new Response(JSON.stringify({ error: "Unauthorized access to organization users" }), {
                status: 403,
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