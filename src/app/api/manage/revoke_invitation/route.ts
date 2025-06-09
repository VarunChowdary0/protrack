import { db } from "@/db/drizzle";
import { inbox } from "@/db/Schema/InboxSchema";
import { invitations } from "@/db/Schema/InvitationSchema";
import { eq } from "drizzle-orm";

export async function DELETE(req:Request) {
    try{
        const body = await req.json();
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