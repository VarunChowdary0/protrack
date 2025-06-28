import { db } from "@/db/drizzle";
import { participants } from "@/db/Schema/ParticipantSchema";
import { projects } from "@/db/Schema/ProjectSchema";
import { users } from "@/db/Schema/UserSchema";
import { getUser } from "@/lib/GetUser";
import { and, eq, or } from "drizzle-orm";

export async function GET(req:Request) {
    try{
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];
        const reqFromUser = await getUser(userId);

        // console.log(reqFromUser)

        if (!reqFromUser.user.id) {
            return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const my_projects = await db
            .selectDistinct({
                id: projects.id,
                name: projects.name,
                domain: projects.domain,
                problemStatement: projects.problemStatement,
                createdAt: projects.createdAt,
                updatedAt: projects.updatedAt,
                max_team_size: projects.max_team_size,
                isDraft: projects.isDraft,
                code: projects.code,
                siteLink: projects.site_link,
                repositoryLink: projects.repositoryLink,
                status: projects.status
            })
            .from(participants)
            .innerJoin(projects, eq(participants.projectId, projects.id))
            .innerJoin(users, eq(participants.userId, users.id))
            .where(
                and(
                    or(
                        eq(users.id, reqFromUser.user.id),
                        eq(projects.creator_id, reqFromUser.user.id)
                    ),
                    !reqFromUser.user.access?.createProjects ? eq(projects.isDraft, 0) : eq(projects.isDraft, projects.isDraft)
                )
            );

        return new Response(JSON.stringify(my_projects), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
        }
        catch(error){
        console.error("Error fetching participants:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch participants" }), { status: 500 });
    }
}