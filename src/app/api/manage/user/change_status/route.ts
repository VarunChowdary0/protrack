import { db } from "@/db/drizzle";
import { users } from "@/db/Schema/UserSchema";
import { UserStatus } from "@/types/userTypes";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { userId, status }:{
            userId: string;
            status: UserStatus; 
        } = body;

        if(!userId || !status){
            return new Response(JSON.stringify({ error: "User ID and status are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        // Update user status in the database
        await db.update(users).set({
            userStatus: status,
        }).where(eq(users.id, userId));

        return new Response(JSON.stringify({ message: "User status updated successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error in change status route:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}