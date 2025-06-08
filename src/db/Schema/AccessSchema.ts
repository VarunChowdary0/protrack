import { UserRole } from "@/types/userTypes";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";

export const access = pgTable("accessTable",{
    userRole: text("userRole")
                    .$type<UserRole>()
                    .default(UserRole.USER)
                    .primaryKey(),
    createOrganization: boolean("createOrganization")
                    .default(false), // for admin
    accessOrganization: boolean("accessOrganization")
                    .default(false), // for admin and organization manager
    manageOrganization: boolean("manageOrganization")
                    .default(false), // for admin and organization manager
    createOrganizationManagers: boolean("createOrganizationManagers")
                    .default(false), // only for admin
    accessOrganizationManagers: boolean("accessOrganizationManagers")
                    .default(false), // only for admin
    createOrganizationUsers: boolean("createOrganizationUsers")
                    .default(false), // only for manager 
    accessOrganizationUsers: boolean("accessOrganizationUsers")
                    .default(false), // for admin  organization manager
    accessProjects: boolean("accessProjects")
                    .default(true), // all users have access to projects they are part of
    createProjects: boolean("createProjects")
                    .default(false), // for organization manager / user [individual user can create projects]
    editProjects: boolean("editProjects")
                    .default(false), // for organization manager / user [individual user can edit projects]
    deleteProjects: boolean("deleteProjects")
                    .default(false), // for organization manager / user [individual user can delete projects]
    accessTeam: boolean("accessTeam")
                    .default(true), // all users have access to team they are part of
    mapTeam: boolean("mapTeam")
                    .default(false), // for organization manager / user [individual user can map team]
    accessTimeline: boolean("accessTimeline")
                    .default(true), // all users have access to timeline they are part of
    manageTimeline: boolean("manageTimeline")
                    .default(false), // for organization manager / user [individual user can manage timeline]
    accessActivities: boolean("accessActivities")
                    .default(true), // all users have access to activities they are part of`
    manageActivities: boolean("manageActivities")
                    .default(false), // for organization manager / user [individual user can manage activities]
    accessResources: boolean("accessResources")
                    .default(true), // all users have access to resources they are part of
    manageResources: boolean("manageResources") 
                    .default(true), // all users have access to resources they are part of
    deleteResources: boolean("deleteResources")
                    .default(false), // for organization manager / user [individual user can delete resources]
    accessTasks: boolean("accessTasks")
                    .default(true), // all users have access to tasks they are part of
    hold_cancle_tasks: boolean("hold_cancle_tasks")
                    .default(false), // for organization manager / user [individual user can hold or cancel tasks]
    assignTasks: boolean("assignTasks")
                    .default(false), // for organization manager / user [individual user can assign tasks]
    accessCalendar: boolean("accessCalendar")
                    .default(true), // all users have access to calendar they are part of
    manageCalendar: boolean("manageCalendar")
                    .default(false), // for organization manager / user [individual user can manage calendar]
    accessChat: boolean("accessChat")
                    .default(true), // all users have access to chat they are part of`
    createGroups: boolean("createGroups")
                    .default(false), // for organization manager / user [individual user can create groups]
})