import { db } from "@/db/drizzle";
import { invitations } from "@/db/Schema/InvitationSchema";
import { InboxItemType } from "@/types/inboxType";
import { createInboxEntry } from "./inbox";
import { Invitation } from "@/types/invitationType";
import { eq } from "drizzle-orm";
import { users } from "@/db/Schema/UserSchema";

const MapInvitation = async (NewInvitation: Partial<Invitation>):  Promise<boolean>=> {
    if(!NewInvitation.toEmail) {
        return false; 
    }
    const user = await db.select().from(users).where(
        eq(users.email, NewInvitation.toEmail)
    )
    if(user.length === 0) {
        return false; // No user found with the provided email
    }
    const inboxEntry = {
        fromId: String(NewInvitation.formId) || "",
        participantId: "",
        userId: user[0].id || "",
        projectId:  NewInvitation.projectId ||"",
        title: String(NewInvitation.subject) || "Invitation",
        description: String(NewInvitation.message) || "You have been invited to join the organization",
        type: InboxItemType.INVITE,
        inviteId: NewInvitation.id || "",
        taskId: null, // Optional, default to null if not provided
        calendarId: null, // Optional, default to null if not provided
    };
    try{
        const inboxItem = await createInboxEntry(inboxEntry);
        if(inboxItem && NewInvitation.id){
            await db.update(invitations)
                    .set({mappedAt: new Date().toISOString()})
                    .where(
                        eq(invitations.id, NewInvitation.id)
                    );
            return true;
        }
        return false;
    }
    catch(error){
        console.error("Error creating inbox entry:", error);
        return false;
    }
}

export default MapInvitation;