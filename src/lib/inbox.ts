import { db } from "@/db/drizzle";
import { inbox } from "@/db/Schema/InboxSchema";
import { InboxItemType } from "@/types/inboxType";
interface InboxInput {
  fromId: string;
  participantId: string;
  userId: string;
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
    userId,
    projectId,
    title,
    description,
    type,
    inviteId = null,
    taskId = null,
    calendarId = null,
  } = data;

  console.log(data);

  if (!fromId || !userId || !title || !description || !type) {
    throw new Error("Missing required fields");
  }
  const newInboxEntry = {
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
    timestamp: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };


  const [createdInboxEntry] = await db.insert(inbox).values(newInboxEntry).returning();
  return createdInboxEntry;
}