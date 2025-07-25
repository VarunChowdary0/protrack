import { Access } from "@/types/accessType";
import { UserRole } from "@/types/userTypes";

    const userAccess: Access = {
      userRole: UserRole.USER,
      createOrganization: false,
      accessOrganization: false,
      manageOrganization: false,
      createOrganizationManagers: false,
      accessOrganizationManagers: false,
      createOrganizationUsers: false,
      accessOrganizationUsers: false,
      accessProjects: true,
      createProjects: true,
      editProjects: false,
      deleteProjects: false,
      accessTeam: true,
      mapTeam: false,
      accessTimeline: true,
      manageTimeline: false,
      accessActivities: true,
      manageActivities: false,
      accessResources: true,
      manageResources: true,
      deleteResources: false,
      accessTasks: true,
      hold_cancle_tasks: false,
      assignTasks: false,
      accessCalendar: true,
      manageCalendar: false,
      accessChat: true,
      createGroups: false,
      manageGroups: true,
    };

    const orgUser: Access = {
      ...userAccess,
      userRole: UserRole.ORG_USER,
      createProjects: false,
      accessOrganizationUsers: true
    };

    const orgManager: Access = {
      userRole: UserRole.ORG_MANAGER,
      createOrganization: false,
      accessOrganization: true,
      manageOrganization: true,
      createOrganizationManagers: false,
      accessOrganizationManagers: true,
      createOrganizationUsers: true,
      accessOrganizationUsers: true,
      accessProjects: true,
      createProjects: true,
      editProjects: true,
      deleteProjects: true,
      accessTeam: true,
      mapTeam: true,
      accessTimeline: true,
      manageTimeline: true,
      accessActivities: true,
      manageActivities: true,
      accessResources: true,
      manageResources: true,
      deleteResources: true,
      accessTasks: true,
      hold_cancle_tasks: true,
      assignTasks: true,
      accessCalendar: true,
      manageCalendar: true,
      accessChat: true,
      createGroups: true,
      manageGroups: true,
    };

    const admin: Access = {
      userRole: UserRole.ADMIN,
      createOrganization: true,
      accessOrganization: true,
      manageOrganization: true,
      createOrganizationManagers: true,
      accessOrganizationManagers: true,
      createOrganizationUsers: false,
      accessOrganizationUsers: true,
      accessProjects: true,
      createProjects: false,
      editProjects: false,
      deleteProjects: false,
      accessTeam: true,
      mapTeam: true,
      accessTimeline: true,
      manageTimeline: false,
      accessActivities: true,
      manageActivities: false,
      accessResources: true,
      manageResources: false,
      deleteResources: false,
      accessTasks: true,
      hold_cancle_tasks: false,
      assignTasks: true,
      accessCalendar: true,
      manageCalendar: false,
      accessChat: true,
      createGroups: true,
      manageGroups: false,
    };

export {
    userAccess,
    orgUser,
    orgManager,
    admin
}