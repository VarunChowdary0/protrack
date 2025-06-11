import { db } from "@/db/drizzle";
import { organizations } from "@/db/Schema/OrganizationSchema";
import { getUser } from "@/lib/GetUser";

export async function GET(req: Request) {
    try{
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
        if(!reqFromUser.user.access?.accessOrganizationManagers) {
            return new Response(JSON.stringify({ error: "Unauthorized access to organization" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        const orgs = await db.select().from(organizations);
        
        return new Response(JSON.stringify(orgs), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    }
    catch(err){
        console.error(err);
        return new Response(
            JSON.stringify({error:"Internal Server error"}) ,{
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        )
    }
}