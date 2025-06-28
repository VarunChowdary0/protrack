import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { Project } from "@/types/projectType";
import { projects } from "@/db/Schema/ProjectSchema";
import { participants } from "@/db/Schema/ParticipantSchema";
import { activities } from "@/db/Schema/AcrivitySchema";
import { timeLines } from "@/db/Schema/TimeLineSchema";
import { resources } from "@/db/Schema/ResourseSchema";
import { users } from "@/db/Schema/UserSchema";

export async function getProject(projectId?: string): Promise<Project | null> {
  if (!projectId) return null;

  // Fetch the base project
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) return null;

  // Fetch all related data
  const [participantRows, activityRows, timelineRows, resourceRows] = await Promise.all([
    db.select({
      id: participants.id,
      userId: participants.userId,
      projectId: participants.projectId,
      isLead: participants.isLead,
      isTeamMember: participants.isTeamMember,
      isActive: participants.isActive,
      role: participants.role,
      createdAt: participants.createdAt,
      updatedAt: participants.updatedAt,
      user: {
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        profilePicture: users.profilePicture,
      }
    }).from(participants)
      .leftJoin(users, eq(participants.userId, users.id))
    .where(eq(participants.projectId, projectId)),
    db.select().from(activities).where(eq(activities.projectId, projectId)),
    db.select().from(timeLines).where(eq(timeLines.projectId, projectId)),
    db.select().from(resources).where(eq(resources.projectId, projectId)),
  ]);

  // Construct the final object
  return {
    ...project,
    participants: participantRows.map(p => ({ ...p, user: p.user || undefined })),
    activities: activityRows,
    timelines: timelineRows,
    resources: resourceRows,
  };
}
