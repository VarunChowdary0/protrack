import { pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./UserSchema";
import { InvitationAction, OrganizationUserRole } from "@/types/invitationType";
import { organizations } from "./OrganizationSchema";
import { projects } from "./ProjectSchema";

export const invitations = pgTable("invitations", {
    id: text("id").primaryKey(),
    formId: text("form_id").references(()=> users.id, { onDelete: "no action" }),
    toEmail: text("to_email").notNull(),
    invitited_to: text("invited_to").notNull(), // e.g., admin, be manager for org, to organization, etc. 
    subject: text("subject").notNull(), // inivitation subject
    message: text("message").notNull(), // invitation message
    action: text("action").$type<InvitationAction>().default(InvitationAction.JOIN_ORGANIZATION),
    org_id: text("org_id").notNull().references(() => organizations.id, { onDelete: "no action" }),
    role: text("role").$type<OrganizationUserRole>().default(OrganizationUserRole.MEMBER).notNull(),

    // if invited to a individual project, this will be the project id
    projectId: text("project_id").references(() => projects.id, { onDelete: "no action" }),
    projectRole: text("project_role"), // lead, fe, be, sales , tester etc.

    createdAt: text("created_at").default(new Date().toISOString()).notNull(),
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull(),

    mappedAt: text("mappedAt").default("") // date
});

// 