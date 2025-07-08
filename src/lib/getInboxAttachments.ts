import { db } from "@/db/drizzle";
import { documents } from "@/db/Schema/DoumentSchema";
import { inboxAttachments } from "@/db/Schema/InboxAttachmentSchema";
import { InboxAttachment } from "@/types/inboxType";
import { eq } from "drizzle-orm";

const getInboxAttachments = async (inboxId: string): Promise<InboxAttachment[]> => {
    if (!inboxId) return [];

    const items = await db
        .select()
        .from(inboxAttachments)
        .where(eq(inboxAttachments.inboxId, inboxId));

    const data = await Promise.all(
        items.map(async (attachment) => {
            const [doc] = await db
                .select()
                .from(documents)
                .where(eq(documents.id, attachment.documentId));

            return {
                ...attachment,
                document: doc, // optional chaining if doc may be undefined
            };
        })
    );

    return data;
};

export default getInboxAttachments;
