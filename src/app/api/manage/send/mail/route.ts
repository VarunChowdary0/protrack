import { db } from "@/db/drizzle";
import { inboxAttachments } from "@/db/Schema/InboxAttachmentSchema";
import { getUser } from "@/lib/GetUser";
import { createInboxEntry } from "@/lib/inbox";
import send_Notification from "@/lib/SendNotification";
import { uploadFile } from "@/lib/UploadFile";
import { FileType } from "@/types/documentType";
import { InboxItemType } from "@/types/inboxType";

const getFileType = (fileName: string): FileType => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf": return FileType.PDF;
    case "doc": return FileType.DOC;
    case "docx": return FileType.DOCX;
    case "ppt": return FileType.PPT;
    case "pptx": return FileType.PPTX;
    case "xls": return FileType.XLS;
    case "xlsx": return FileType.XLSX;
    case "txt": return FileType.TXT;
    case "png": return FileType.PNG;
    case "jpg":
    case "jpeg": return FileType.JPG;
    case "gif": return FileType.GIF;
    case "mp4": return FileType.MP4;
    case "mp3": return FileType.MP3;
    default: return FileType.OTHER;
  }
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("USER_ID ")) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401 });
    }

    const userId = authHeader.split(" ")[1];
    const reqUser = await getUser(userId);

    if (!reqUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const form = await request.formData();

    const toIds = JSON.parse(form.get("toIds") as string) as string[];
    const subject = form.get("subject") as string;
    const text = form.get("text") as string;
    const attachments = form.getAll("attachments") as File[];


    if (!toIds || !subject || !text) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Create the inbox entry
    const inboxId = await createInboxEntry({
      fromId: userId,
      participantId: "",
      userIds: toIds,
      projectId: "",
      title: subject,
      description: text,
      type: InboxItemType.MESSAGE,
    });

    // Upload all attachments and link to inbox
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        const doc = await uploadFile({
          name: file.name || "Attachment",
          description: "Mail Attachment",
          fileType: getFileType(file.name),
          file,
        });

        await db.insert(inboxAttachments).values({
          id: crypto.randomUUID(),
          inboxId,
          documentId: doc.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Notify recipients
    await send_Notification({
      userIds: toIds,
      title: subject,
      body: text.substring(0, 30) + "...",
      url: `/u/mail/${inboxId}`,
      icon: reqUser.user.profilePicture || "",
      data: {
        type: InboxItemType.MESSAGE,
        title: subject,
        description: text,
      },
      tag: `mail-${userId}`,
      requireInteraction: true,
      silent: false,
      vibrate: [400, 100, 200],
      timestamp: Date.now(),
      actions: [
        { action: "view", title: "View Mail", icon: "/icons/mail.png" },
        { action: "reply", title: "Reply", icon: "/icons/reply.png" },
      ],
      renotify: true,
    });

    return new Response(JSON.stringify({ message: "Mail sent successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error sending mail:", error);
    return new Response(JSON.stringify({ error: "Failed to send mail" }), { status: 500 });
  }
}
