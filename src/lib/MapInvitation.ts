import { db } from "@/db/drizzle";
import { invitations } from "@/db/Schema/InvitationSchema";
import { InboxItemType } from "@/types/inboxType";
import { createInboxEntry } from "./inbox";
import { Invitation } from "@/types/invitationType";
import { eq } from "drizzle-orm";
import { users } from "@/db/Schema/UserSchema";
import send_Notification from "./SendNotification";

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
            let notificationSent = false;
            const maxRetries = 3;
            for (let i = 0; i < maxRetries && !notificationSent; i++) {
                try {
                    notificationSent = await send_Notification({
                        userIds: [user[0].id || ""],
                        title: NewInvitation.subject || "Invitation",
                        body: NewInvitation.message || "You have been invited to join the organization",
                        url: `u/inbox`,
                        requireInteraction: true,
                        data: {
                            type: InboxItemType.INVITE,
                            inviteId: NewInvitation.id || "",
                        },
                        tag: `invite-${NewInvitation.id}`,
                        renotify: true,
                        silent: false,
                        vibrate: [200, 100, 200],
                        timestamp: Date.now(),
                        actions: [
                            { action: "accept", title: "Accept", icon: "/icons/accept.png" },
                            { action: "decline", title: "Decline", icon: "/icons/decline.png" }
                        ]
                    });
                    if (!notificationSent) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                    }
                } catch (error) {
                    console.error(`Notification retry ${i + 1} failed:`, error);
                    if (i === maxRetries - 1) return false;
                }
            }
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