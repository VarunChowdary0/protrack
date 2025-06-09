import { db } from "@/db/drizzle";
import { organizations } from "@/db/Schema/OrganizationSchema";
import { v4 as uuid } from "uuid";

export async function POST(req:Request) {
    try{
        const body = await req.json();
        const {
            name,
            description,
            logo,
            slug,
        } = body;
        if (!name || !description || !slug) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
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