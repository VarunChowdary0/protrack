import { db } from "@/db/drizzle";
import { users } from "@/db/Schema/UserSchema";
import { and, eq } from "drizzle-orm";

export async function PATCH(req: Request) {
    try{
        const body = await req.json();
        const { userId, oldPassword, newPassword } = body;
        if (!userId || !oldPassword || !newPassword) {
            return new Response(JSON.stringify({ error: "User ID, old password, and new password are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await db.select()
                            .from(users)
                            .where(and(
                                eq(users.id, userId),
                                eq(users.password, oldPassword)
                            ));

        if (user.length === 0) {
            return new Response(JSON.stringify({ error: "Invalid user ID or old password" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        await db.update(users)
            .set({ password: newPassword })
            .where(eq(users.id, userId));
        return new Response(JSON.stringify({ message: "Password changed successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch(error){
        console.error("Error in UPDATE /manage/user/change_password:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}