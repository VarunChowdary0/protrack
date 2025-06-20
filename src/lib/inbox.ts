import { db } from "@/db/drizzle";
import { inbox } from "@/db/Schema/InboxSchema";
import { InboxItemType } from "@/types/inboxType";

interface InboxInput {
  fromId: string;
  participantId: string;
  userIds: string[];
  projectId: string;
  title: string;
  description: string;
  type: InboxItemType;
  inviteId?: string | null;
  taskId?: string | null;
  calendarId?: string | null;
}

export async function createInboxEntry(data: InboxInput) {
  const {
    fromId,
    participantId,
    userIds,
    projectId,
    title,
    description,
    type,
    inviteId = null,
    taskId = null,
    calendarId = null,
  } = data;

  if (!fromId || !userIds?.length || !title || !description || !type) {
    throw new Error("Missing required fields");
  }

  const now = new Date().toISOString();

  const entries = userIds.map((userId) => ({
    id: crypto.randomUUID(),
    fromId,
    participantId,
    userId,
    projectId,
    title,
    description,
    type,
    inviteId,
    taskId,
    calendarId,
    timestamp: now,
    updatedAt: now,
  }));

  const createdInboxEntries = await db.insert(inbox).values(entries).returning();

  return createdInboxEntries;
}
