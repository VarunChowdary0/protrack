import { db } from "@/db/drizzle";
import { inbox } from "@/db/Schema/InboxSchema";
import { invitations } from "@/db/Schema/InvitationSchema";
import { participants } from "@/db/Schema/ParticipantSchema";
import { users } from "@/db/Schema/UserSchema";
import send_Notification from "@/lib/SendNotification";
import { InvitationAction, InvitationStatus } from "@/types/invitationType";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
    try{
        const authHeader = req.headers.get("Authorization");
        if(!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];

        const data = await req.json();

        const {
            inboxId,
            fromUserId,
            users_email,
            action,
            inviteId,
            role,
            orgId,
            projectId,
            status,
            slug
        } = data;

        if(!inboxId || !action || !role) {
            return new Response(JSON.stringify({ error: "inbox id and action and role required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if( !orgId && !projectId ) {
            return new Response(JSON.stringify({ error: "orgId or projectId required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // mark inbox item as seen.
        await db.update(inbox).set({
            seenAt: new Date().toISOString(),
        }).where(and(
            eq(inbox.id, inboxId),
            eq(inbox.userId, userId)
        ));
        console.log("seen")

        if(action === InvitationAction.INVITE_ORGANIZATION){
            if(!orgId || !role) {
                return new Response(JSON.stringify({ error: " orgId, role required for invite type" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
            // assign organization.
            if(status === InvitationStatus.ACCEPTED){
                await db.update(users).set({
                    organizationId: orgId,
                    role: role
                }).where(eq(users.id, userId));
                send_Notification({
                    userIds: [fromUserId],
                    title: "Invitation Accepted",
                    body: `✔️ ${users_email} has accepted your invitation to join the organization ${orgId} as ${role}.`,
                    data: {
                        inviteId: inviteId,
                        orgId: orgId,
                        role: role
                    },
                    url: slug ? `/org/${slug}` : "/admin/organizations"
                })
            }
            else{
                send_Notification({
                    userIds: [fromUserId],
                    title: "Invitation Rejected",
                    body: `⚠️ ${users_email} has rejected your invitation to join the organization ${orgId} as ${role}.`,
                    data: {
                        inviteId: inviteId,
                        orgId: orgId,
                        role: role
                    },
                    url: slug ? `/org/${slug}` : "/admin/organizations"
                })
            }

            await db.update(invitations).set({
                status: status
            }).where(eq(invitations.id, inviteId));

            
            return new Response(JSON.stringify({ message: "Invitation accepted and organization assigned." }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
        if(action === InvitationAction.EXTERNAL_PROJECT_INVITATION){
            if(!projectId || !role) {
                return new Response(JSON.stringify({ error: " projectId, role required for invite type" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            await db.insert(participants).values({
                id: crypto.randomUUID(),
                userId: userId,
                projectId: projectId,
                role: role,
                isLead: false, // default to false, can be updated later
                isTeamMember: true, // default to true, can be updated later
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            // assign project.
        }

        return new Response(JSON.stringify({ message: "Invitation action processed successfully." }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    }
    catch(error){
        console.log(error)
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}