import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { projects } from "./ProjectSchema";
import { users } from "./UserSchema";
import { sql } from "drizzle-orm";
import { ParticipantRole } from "@/types/participantType";

export const participants = pgTable("participants", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(()=> users.id , { onDelete: 'cascade'}).notNull(), // Reference to the user
    projectId: text("project_id").references(()=> projects.id, { onDelete: 'cascade'}).notNull(), // Reference to the project
    isLead: boolean("is_lead").notNull().default(false), // true if the participant is a lead in the project
    isTeamMember: boolean("is_team_member").notNull().default(true), // member = true, supervisor = false
    role: text("role").$type<ParticipantRole>().default(ParticipantRole.CUSTOM).notNull(), // Role of the participant in the project /dev/tester/designer etc.
    isActive: boolean("is_active").default(true).notNull(), // true if the participant is active in the project
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});