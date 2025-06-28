import { getUser } from "@/lib/GetUser";
import { createInboxEntry } from "@/lib/inbox";
import send_Notification from "@/lib/SendNotification";
import { InboxItemType } from "@/types/inboxType";

export async function POST(request: Request) {
    try{
        const authHeader = request.headers.get("Authorization");
        if(!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];
        const reqUser = await getUser(userId);
        if(!reqUser) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        const body = await request.json();
        const { toIds, subject, text, image } = body;
        if (!toIds || !subject || !text) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        await createInboxEntry({
            fromId: userId,
            participantId:"",
            userIds: toIds,
            projectId: "",
            title: subject,
            description: text,
            type: InboxItemType.MESSAGE,
        });

        send_Notification({
            userIds: toIds,
            title: subject,
            body: text.substring(0, 30)+"...", // Limit body length for notification
            url: `/u/mail`,
            icon: reqUser.user.profilePicture || "",
            image: image || "",
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
                { action: "reply", title: "Reply", icon: "/icons/reply.png" }
            ],
            renotify: true,
        });

        return new Response(JSON.stringify({ message: "Mail sent successfully" }), { status: 200 });
    }
    catch (error) {
        console.error("Error sending mail:", error);
        return new Response(JSON.stringify({ error: "Failed to send mail" }), { status: 500 });
    }
}