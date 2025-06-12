import { db } from "@/db/drizzle";
import { invitations } from "@/db/Schema/InvitationSchema";
import { getUser } from "@/lib/GetUser";
import MapInvitation from "@/lib/MapInvitation";
import { InvitationAction, OrganizationUserRole } from "@/types/invitationType";
import {v4 as uuid} from "uuid";

export async function POST(req:Request) { 
    try{
        // validate, only admin: invite to be manager
        // validate, only manager: invite to be member
        // normal user can invite to a project

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
        if(!reqFromUser.user.id){
            return new Response(JSON.stringify({ error: "User not found",
             action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        //-- permission check
        const body = await req.json();
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

        if (action === InvitationAction.INVITE_ORGANIZATION && 
            role === OrganizationUserRole.MANAGER){
            // check if the user is an admin
            if(!reqFromUser.user.access?.createOrganizationManagers){
                return new Response(JSON.stringify({ error: "You do not have permission to invite organization managers" }), {
                    status: 403,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }
        else if (action === InvitationAction.INVITE_ORGANIZATION){
            // check if the user is a manager
            if(!reqFromUser.user.access?.createOrganizationUsers){
                return new Response(JSON.stringify({ error: "You do not have permission to invite organization members / clients " }), {
                    status: 403,
                    headers: { "Content-Type": "application/json" },
                });
            }
        } // else if (action === InvitationAction.INVITE_PROJECT) normal user can invite to a project

        // --------
            
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
            invitedTo: " be"+ role + " in your organization",
            subject,
            message,
            action,
            org_id: org_id,
            role,
            projectId: projectId || null, // Optional, default to null if not provided
            projectRole: projrctRole || null, // Optional, default to null if not provided
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).returning();

        const mapper = await MapInvitation({
            id: NewInvitation.id || "",
            toEmail: NewInvitation.toEmail || "",
            formId: NewInvitation.formId || "",
            projectId: NewInvitation.projectId || "",
            subject: NewInvitation.subject || "Invitation",
            message: NewInvitation.message || "You have been invited to join the organization",
        });
        
        if(mapper){
            return new Response(JSON.stringify({ message: "Invitation sent successfully", invitationId }), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
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