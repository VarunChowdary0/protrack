import { db } from "@/db/drizzle";
import { participants } from "@/db/Schema/ParticipantSchema";
import { and, eq } from "drizzle-orm";

export async function checkParticipant(projectId: string, userId: string): Promise<{
    isParticipant: boolean;
    participantId?: string;
}> {
  if (!projectId || !userId) return {
    isParticipant: false,
    participantId: undefined
  };

  const [participant] = await db
    .select()
    .from(participants)
    .where(
      and(
        eq(participants.userId, userId),
        eq(participants.projectId, projectId)
      )
    )
    .limit(1);

  return {
    isParticipant: !!participant,
    participantId: participant?.id
  };
}
