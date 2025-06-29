import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { Project } from "@/types/projectType";
import { projects } from "@/db/Schema/project/ProjectSchema";

export async function getBasicPrj(projectId?: string): Promise<Partial<Project> | null> {
  if (!projectId) return null;

  // Fetch the base project
  const [project] = await db
    .select({
        id: projects.id,
        name: projects.name,
        code: projects.code,
        problemStatement: projects.problemStatement,
        status: projects.status,
        visibility: projects.visibility,
        creator_id: projects.creator_id
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) return null;


  return project
}
