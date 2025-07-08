import { db } from "@/db/drizzle";
import { calendar } from "@/db/Schema/CalendarSchema";
import { inbox } from "@/db/Schema/InboxSchema";
import { invitations } from "@/db/Schema/InvitationSchema";
import { tasks } from "@/db/Schema/project/TaskSchema";
import { users } from "@/db/Schema/UserSchema";
import getInboxAttachments from "@/lib/getInboxAttachments";
import { getUser } from "@/lib/GetUser";
import { InboxItemType } from "@/types/inboxType";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    try{
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response("Missing Authorization header", {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];
        // -- user check
        const reqFromUser = await getUser(userId);
        if (!reqFromUser.user.id) {
            return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        // -- permission check --> every user can access their inbox
                
        const user_inbox = await db
        .select()
        .from(inbox)
        .leftJoin(users, eq(inbox.fromId, users.id))                        // fromUser
        .leftJoin(invitations, eq(inbox.inviteId, invitations.id))          // invitation
        .leftJoin(tasks, eq(inbox.taskId, tasks.id))                         // task
        .leftJoin(calendar, eq(inbox.calendarId, calendar.id))            // calendarEvent
        .where(eq(inbox.fromId, reqFromUser.user.id));        
        
        const formattedInbox = await Promise.all(
            user_inbox.map(async (inboxItem) => {
                const inboxData = inboxItem.inbox;

                const attachments = await getInboxAttachments(inboxData.id);

                return {
                    id: inboxData.id,
                    fromId: inboxData.fromId,
                    participantId: inboxData.participantId,
                    userId: inboxData.userId,
                    projectId: inboxData.projectId,
                    title: inboxData.title,
                    description: inboxData.description,
                    type: inboxData.type as InboxItemType,
                    inviteId: inboxData.inviteId,
                    invitation: inboxItem.invitations
                        ? {
                            ...inboxItem.invitations,
                            mappedAt: inboxItem.invitations.mappedAt || undefined
                        }
                        : undefined,
                    taskId: inboxData.taskId,
                    task: inboxItem.tasks ? { ...inboxItem.tasks } : undefined,
                    calendarId: inboxData.calendarId,
                    calendarEvent: inboxItem.calendar ? { ...inboxItem.calendar } : undefined,
                    seenAt: inboxData.seenAt,
                    isArchived: inboxData.isArchived,
                    isDeleted: inboxData.isDeleted,
                    isStarred: inboxData.isStarred,
                    timestamp: inboxData.timestamp,
                    updatedAt: inboxData.updatedAt,
                    fromUser: {
                        id: inboxItem.users?.id || "",
                        name: `${inboxItem.users?.firstname || ""} ${inboxItem.users?.lastname || ""}`.trim(),
                        email: inboxItem.users?.email || "",
                        profilePicture: inboxItem.users?.profilePicture || "",
                    },
                    attachments: attachments || [],
                };
            })
        );

        // console.log(formattedInbox)
        return new Response(JSON.stringify(formattedInbox), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch (error) {
        console.error("Error in GET /inbox:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}