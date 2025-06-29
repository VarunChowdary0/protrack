import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { Project } from "@/types/projectType";
import { projects } from "@/db/Schema/project/ProjectSchema";
import { participants } from "@/db/Schema/ParticipantSchema";
import { activities } from "@/db/Schema/project/AcrivitySchema";
import { resources } from "@/db/Schema/project/ResourseSchema";
import { users } from "@/db/Schema/UserSchema";
import { documents } from "@/db/Schema/DoumentSchema";
import { getProjectTimeLines } from "./GetProjectTimeLines";

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
    getProjectTimeLines(projectId),
    db.select({
      id: resources.id,
      projectId: resources.projectId,
      ownerId: resources.ownerId,
      documentId: resources.documentId,
      createdAt: resources.createdAt,
      updatedAt: resources.updatedAt,
      document: {
        id: documents.id,
        name: documents.name,
        description: documents.description,
        filePath: documents.filePath,
        fileType: documents.fileType,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
      }
    })
    .from(resources)
    .leftJoin(documents, eq(resources.documentId, documents.id))
    .where(eq(resources.projectId, projectId)),
  ]);

  // Construct the final object
  return {
    ...project,
    participants: participantRows.map(p => ({ ...p, user: p.user || undefined })),
    activities: activityRows,
    timelines: timelineRows,
    resources: resourceRows.map(r => ({...r, document: r.document || undefined })),
  };
}
