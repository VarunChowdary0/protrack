import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { projects } from "./ProjectSchema";
import { users } from "./UserSchema";

export const participants = pgTable("participants", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(()=> users.id , { onDelete: 'cascade'}), // Reference to the user
    projectId: text("project_id").references(()=> projects.id, { onDelete: 'cascade'}), // Reference to the project
    isLead: boolean("is_lead").notNull().default(false), // true if the participant is a lead in the project
    isTeamMember: boolean("is_team_member").notNull().default(true), // member = true, supervisor = false
    role: text("role").notNull(), // Role of the participant in the project /dev/tester/designer etc.
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
});