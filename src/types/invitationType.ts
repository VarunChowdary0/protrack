export enum InvitationAction {
    JOIN_ORGANIZATION = "join_organization",
    JOIN_ORGANIZATION_AS_MANAGER = "join_organization_as_manager",
    ACCEPT_EXTERNAL_PROJECT_INVITATION = "accept_external_project_invitation"
}

export enum OrganizationUserRole{
    MANAGER = "manager",
    MEMBER = "member",
    ADMIN = "admin",
    CLIENT = "client",
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
    role: OrganizationUserRole; // e.g., manager, member, admin, client
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}