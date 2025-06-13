import { pgTable, text, json, integer, boolean } from "drizzle-orm/pg-core";
import { users } from "./UserSchema";

export const notifications = pgTable("notification", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint"),
  failureCount: integer("failure_count").default(0),
  isActive: boolean("is_active").default(true),
  notificationJson: json("notification_json").$type<PushSubscriptionJSON>() // use .$type<PushSubscriptionJSON>() if needed
});
