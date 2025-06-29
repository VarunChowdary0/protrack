import { db } from "@/db/drizzle";
import { getUser } from "@/lib/GetUser";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { ProjectStatus } from "@/types/projectType";
import { addParticipant } from "@/lib/AddParticipant";
import { ParticipantRole } from "@/types/participantType";
import { projects } from "@/db/Schema/project/ProjectSchema";

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("USER_ID ")) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = authHeader.split(" ")[1];
    const reqFromUser = await getUser(userId);

    if (!reqFromUser.user.id) {
      return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!reqFromUser.user.access?.createProjects) {
      return new Response(
        JSON.stringify({ error: "You do not have permission to create/update projects" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    const {
      id,
      stepCompleted,
      isDraft,
      code,
      name,
      domain,
      problemStatement,
      maxTeamSize,
      siteLink,
      repositoryLink,
      visibility,
      deadline,
      durationInDays,
      techStack,
      location,
      status
    } = body;

    // Sanitize and convert values
    const sanitizedSiteLink = siteLink?.trim() || "";
    const sanitizedRepoLink = repositoryLink?.trim() || "";
    const sanitizedDeadline = deadline?.trim() || new Date().toISOString(); // or null if allowed
    const sanitizedTechStack = techStack?.trim() || "";
    const sanitizedLocation = location?.trim() || "";


    const parsedMaxTeamSize = maxTeamSize === "" ? null : parseInt(maxTeamSize);
    const parsedDurationInDays = durationInDays === "" ? null : parseInt(durationInDays);
    let resData;
    if (id) {
      // Update project
      [resData] = await db
        .update(projects)
        .set({
          code,
          name,
          domain,
          problemStatement,
          max_team_size: parsedMaxTeamSize || 0,
          site_link: sanitizedSiteLink,
          repositoryLink: sanitizedRepoLink,
          visibility,
          deadline: sanitizedDeadline,
          durationInDays: parsedDurationInDays ?? 30,
          techStack: sanitizedTechStack,
          location: sanitizedLocation,
          stepCompleted,
          isDraft,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(projects.id, id)).returning();

      return new Response(JSON.stringify({ message: "Project updated", id,project: resData }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Create new project
      const newId = uuidv4();

      [resData] = await db.insert(projects).values({
        id: newId,
        organization_id: reqFromUser.user.organizationId || "1",
        creator_id: reqFromUser.user.id,
        code,
        name,
        domain,
        problemStatement,
        max_team_size: parsedMaxTeamSize || 0,
        site_link: sanitizedSiteLink,
        repositoryLink: sanitizedRepoLink,
        visibility,
        deadline: sanitizedDeadline,
        durationInDays: parsedDurationInDays ?? 30,
        techStack: sanitizedTechStack,
        location: sanitizedLocation,
        stepCompleted,
        isDraft,
        status: status || ProjectStatus.NOT_STARTED,
      }).returning();

      await addParticipant({
        userId: reqFromUser.user.id,
        projectId: newId,
        isLead: false,
        isTeamMember: false,
        role: ParticipantRole.CREATOR
      });

      return new Response(JSON.stringify({ message: "Project created", id: newId, project: resData }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in PUT /api/project/add/draft:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
