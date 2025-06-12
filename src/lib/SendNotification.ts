import { db } from "@/db/drizzle";
import { notifications } from "@/db/Schema/NotificationSchema";
import { eq } from "drizzle-orm";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:saivarunchowdarypoludasu4248.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);


const send_Notification = async (payload : {
    userId: string;
    title: string;
    body: string;
    url?: string;
    icon?: string;
    image?: string;
    badge?: string;
    data?: Record<string, unknown>;
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    vibrate?: number[];
    timestamp?: number;
    actions?: Array<{ action: string; title: string; icon?: string }>;
    renotify?: boolean;
}): Promise<boolean> => {
    try{
        console.log("New Notifcation Payload:", payload);
        const userSubscriptions = await db
              .select()
              .from(notifications)
              .where(eq(notifications.userId, payload.userId));
        
            for (const sub of userSubscriptions) {
              if (sub.notificationJson) {
                try{
                    await webpush.sendNotification(
                    sub.notificationJson as webpush.PushSubscription,
                    JSON.stringify(payload) // ✅ full payload here
                    );
                }
                catch(e){
                    console.log(e," one failed to send notification");
                }
              }
            }

            return true;
    }
    catch (error) {
        console.error(error)
        return false;
    }
}

export default send_Notification;