import { ParticipantRole } from "./participantType";
import { UserRole } from "./userTypes";

export enum InvitationAction {
    INVITE_ORGANIZATION = "invite_organization",
    EXTERNAL_PROJECT_INVITATION = "external_project_invitation"
}

export enum OrganizationUserRole{
    MANAGER = UserRole.ORG_MANAGER,
    MEMBER = UserRole.ORG_USER,
    // ADMIN = "admin",
    // CLIENT = "client",
}

export enum InvitationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    DECLINED = "declined"
}

export interface Invitation{
    id: string;
    formId: string;
    toEmail: string;
    invitedTo: string; // e.g., admin, be manager for org, to organization, etc.
    subject: string; // invitation subject
    message: string; // invitation message
    action: InvitationAction; // e.g., accept, decline, etc.
    org_id?: string; // organization id if the invitation is for an organization
    projectId?: string; // project id if the invitation is for a project
    role: OrganizationUserRole | ParticipantRole; // e.g., manager, member, admin, client
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    mappedAt?: string; // ISO date string, when the invitation was mapped to an inbox entry
    status: InvitationStatus; // e.g., pending, accepted, declined
}