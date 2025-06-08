import { db } from "@/db/drizzle";
import { access } from "@/db/Schema/AccessSchema";
import { Access } from "@/types/accessType";
import { UserRole } from "@/types/userTypes";

export async function GET() {
  try {
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
      createProjects: false,
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

    await db.insert(access).values([
        userAccess,
        orgUser,
        orgManager,
        admin,
    ]);

    return new Response(JSON.stringify("Access Uploaded"), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error in GET /api/access:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
