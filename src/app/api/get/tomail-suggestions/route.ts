import { db } from "@/db/drizzle";
import { users } from "@/db/Schema/UserSchema";
import { like, or } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if(!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const _URL = new URL(request.url);
        const searchParams = _URL.searchParams;
        const query = searchParams.get("query") || "";

        const ress = await db.select({
            id: users.id,
            email: users.email,
            firstname: users.firstname,
            lastname: users.lastname,
            profilePicture: users.profilePicture
        })
        .from(users)
        .where(
            or(
                like(users.firstname, `%${query}%`),
                like(users.lastname, `%${query}%`),
                like(users.email, `%${query}%`)
            )
        )
        .limit(10);

        return new Response(JSON.stringify(ress), { status: 200 });
    } catch (error) {
        console.error("Error fetching mail suggestions:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch suggestions" }), { status: 500 });
    }
}
