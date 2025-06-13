import { db } from "@/db/drizzle";
import { notifications } from "@/db/Schema/NotificationSchema";
import { eq, and, inArray } from "drizzle-orm";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:saivarunchowdarypoludasu4248.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const send_Notification = async (payload: {
  userIds: string[]; // updated to accept multiple users
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
  try {
    console.log("Sending Notifications to users:", payload.userIds);

    const subscriptions = await db
      .select()
      .from(notifications)
      .where(
        and(
          inArray(notifications.userId, payload.userIds),
          eq(notifications.isActive, true)
        )
      );

    for (const sub of subscriptions) {
      const failureCount = sub.failureCount ?? 0;

      if (!sub.notificationJson || failureCount >= 3) {
        // mark inactive instead of delete
        await db
          .update(notifications)
          .set({ isActive: false })
          .where(eq(notifications.id, sub.id));
        continue;
      }

      const payloadString = JSON.stringify(payload);

      let attempt = 0;
      let success = false;

      while (attempt < 3 && !success) {
        try {
          await webpush.sendNotification(
            sub.notificationJson as webpush.PushSubscription,
            payloadString
          );

          // Reset failureCount on success
          if (failureCount > 0) {
            await db
              .update(notifications)
              .set({ failureCount: 0 })
              .where(eq(notifications.id, sub.id));
          }

          success = true;
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          attempt++;

          if (attempt >= 3) {
            await db
              .update(notifications)
              .set({ failureCount: failureCount + 1 })
              .where(eq(notifications.id, sub.id));

            if (failureCount + 1 >= 3) {
              await db
                .update(notifications)
                .set({ isActive: false })
                .where(eq(notifications.id, sub.id));
            }
          } else {
            // Exponential backoff: 500ms → 1000ms → 2000ms
            await delay(2 ** attempt * 250);
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Batch Notification Error:", error);
    return false;
  }
};

export default send_Notification;
