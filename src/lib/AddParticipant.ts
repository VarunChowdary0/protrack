import { db } from "@/db/drizzle";
import { participants } from "@/db/Schema/ParticipantSchema";
import { Participant, ParticipantRole } from "@/types/participantType";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function addParticipant(data:Partial<Participant>): Promise<{
    success: boolean;
    message?: string;
    participant?: Participant;
}> {
    if(!data.userId || !data.projectId) {
        return {
            success: false,
            message: "User ID and Project ID are required"
        };
    }
    const check = await db.select().from(participants).where(
        and(
            eq(participants.userId, data.userId),
            eq(participants.projectId, data.projectId)
        )
    );

    if(check.length > 0) {
        return {
            success: false,
            message: "Participant already exists",
            participant: check[0]
        }; // Participant already exists
    }

    const [retu] = await db.insert(participants).values({
        id: uuidv4(),
        userId: data.userId,
        projectId: data.projectId,
        isLead: data.isLead ?? false,
        isTeamMember: data.isTeamMember ?? false,
        role: data.role || ParticipantRole.CUSTOM,
    }).returning();
    return {
        success: true,
        message: "Participant added successfully",
        participant: {
            id: retu.id, // This should ideally be the ID returned from the database
            userId: retu.userId,
            projectId: retu.projectId,
            isLead: retu.isLead,
            isTeamMember: retu.isTeamMember,
            role: retu.role,
            isActive: retu.isActive, // Default to active
            createdAt: retu.createdAt,
            updatedAt: retu.updatedAt,
        }
    };
}