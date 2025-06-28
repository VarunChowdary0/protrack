import { db } from "@/db/drizzle";
import { inbox } from "@/db/Schema/InboxSchema";
import { invitations } from "@/db/Schema/InvitationSchema";
import { getUser } from "@/lib/GetUser";
import { eq } from "drizzle-orm";

export async function DELETE(req:Request) { // only authorized users can delete invitations
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
        if(reqFromUser.user.access?.editProjects && !reqFromUser.user.access?.manageOrganization) {
            return new Response(JSON.stringify({ error: "Unauthorized access to organization" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        //-----
        const { invitationId } = body;
        if (!invitationId) {
            return new Response(JSON.stringify({ error: "Invitation ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Delete the invitation from the database
        const result = await db.delete(invitations).where(eq(invitations.id, invitationId));
        const inboxDel = await db.delete(inbox).where(eq(inbox.inviteId, invitationId));
        if (result.rowCount === 0 && inboxDel.rowCount === 0) {
            return new Response(JSON.stringify({ error: "Invitation not found or already revoked" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ message: "Invitation revoked successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch(error){
        console.error("Error in DELETE /manage/revoke_invitation:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}