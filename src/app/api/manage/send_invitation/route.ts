import { db } from "@/db/drizzle";
import { invitations } from "@/db/Schema/InvitationSchema";
import { users } from "@/db/Schema/UserSchema";
import { createInboxEntry } from "@/lib/inbox";
import { InboxItemType } from "@/types/inboxType";
import { eq } from "drizzle-orm";
import {v4 as uuid} from "uuid";

export async function POST(req:Request) {
    try{
        const body = await req.json();
        console.log(body)
        const {
            fromId,
            toEmail,
            subject,
            message,
            action,
            org_id,

            projectId,
            projrctRole,
            
            role
        } = body;
        if (!fromId || !toEmail || !subject || !message || !action || !org_id || !role) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        const invitationId = uuid();
    
        const [NewInvitation] = await db.insert(invitations).values({
            id: invitationId,
            formId: fromId,
            toEmail: toEmail,
            invitited_to: " be"+ role + " in your organization",
            subject,
            message,
            action,
            org_id: org_id,
            role,
            projectId: projectId || null, // Optional, default to null if not provided
            projectRole: projrctRole || null // Optional, default to null if not provided
        }).returning();

        const user = await db.select()
                            .from(users)
                            .where(eq(users.email, toEmail));
        if (user.length > 0) {
            const inboxEntry = {
                fromId: NewInvitation.formId || "",
                participantId: "",
                userId: user[0].id || "",
                projectId: NewInvitation.projectId || "",
                title: NewInvitation.subject || "Invitation",
                description: NewInvitation.message || "You have been invited to join the organization",
                type: InboxItemType.INVITE,
                inviteId: NewInvitation.id || "",
                taskId: null, // Optional, default to null if not provided
                calendarId: null, // Optional, default to null if not provided
            };
            try{
                const inboxItem = await createInboxEntry(inboxEntry);
                if(inboxItem){
                     await db.update(invitations).set({mappedAt: new Date().toISOString()}).where(eq(invitations.id, NewInvitation.id));
                     return new Response(JSON.stringify({ message: "Invitation sent successfully", invitationId }), {
                        status: 201,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }
            catch(error){
                console.error("Error creating inbox entry:", error);
                return new Response(JSON.stringify({ error: "Failed to create inbox entry" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        return new Response(JSON.stringify({ message: "Invitation saved, not mapped", invitationId }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch(error){
        console.error("Error in POST /manage/send_invitation:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}