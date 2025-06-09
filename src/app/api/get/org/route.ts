import { db } from "@/db/drizzle";
import { organizations } from "@/db/Schema/OrganizationSchema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const slug = url.searchParams.get("slug");

        if (!slug) {
            return new Response(JSON.stringify({ error: "Slug is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Fetch organization by slug from the database
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
    } catch (error) {
        console.error("Error in GET /org:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}