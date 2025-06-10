import { db } from "@/db/drizzle";
import { organizations } from "@/db/Schema/OrganizationSchema";
import { getUser } from "@/lib/GetUser";
import { v4 as uuid } from "uuid";

export async function POST(req:Request) { // olny admin can create organization
    try{
        const body = await req.json();
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
        if(!reqFromUser.user.access?.createOrganization) {
            return new Response(JSON.stringify({ error: "Unauthorized to create organization" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        //-----

        const {
            name,
            description,
            logo,
            slug,
        } = body;
        if (!name || !description || !slug) {
            return new Response(JSON.stringify({ error: "Missing required fields" }),
             { status: 400, headers: { "Content-Type": "application/json" } });
        }


        await db.insert(organizations).values({
            id: uuid(),
            name,
            description,
            logo: logo || "", // Optional, default to empty string if not provided
            slug
        });
        return new Response(JSON.stringify(
                { message: "Organization registered successfully" }
                    ), { status: 201, headers: { 
                        "Content-Type": "application/json" 
                    }
                }
            );
    }
    catch(error){
        console.log(error);
        return new Response(JSON.stringify({ error: "Failed to register organization" }), { status: 500 }); 
    }
}