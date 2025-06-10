import { db } from "@/db/drizzle";
import { inboxAttachments } from "@/db/Schema/InboxAttachmentSchema";
import { InboxAttachment } from "@/types/inboxType";
import { eq } from "drizzle-orm";

const getInboxAttachments = async (inboxId: string): Promise<InboxAttachment[]> => {
    if (!inboxId) {
        return Promise.resolve([]);
    }

    const items = await db.select().from(inboxAttachments)
        .where(eq(inboxAttachments.inboxId,inboxId));
    return items;
}

export default getInboxAttachments;