import { db } from "@/db/drizzle";
import { organizations } from "@/db/Schema/OrganizationSchema";
import { getUser } from "@/lib/GetUser";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        console.log("Auth:",authHeader);
        if(!authHeader){
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

        // any one logged in can access this route

        const url = new URL(req.url);
        const slug = url.searchParams.get("slug");
        const orgId = url.searchParams.get("orgId");

        if (!slug && !orgId) {
            return new Response(JSON.stringify({ error: "Slug/Id is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Fetch organization by slug from the database

        if(slug){
            const org = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);
    
            if (org.length === 0) {
                return new Response(JSON.stringify({ error: "Organization not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }
    
            return new Response(JSON.stringify(org[0]), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
        else{
            const org = await db.select().from(organizations).where(eq(organizations.id, orgId || "1")).limit(1);
    
            if (org.length === 0) {
                return new Response(JSON.stringify({ error: "Organization not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }
    
            return new Response(JSON.stringify(org[0]), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.error("Error in GET /org:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}