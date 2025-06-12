import { pgTable, text, json } from "drizzle-orm/pg-core";
import { users } from "./UserSchema";

export const notifications = pgTable("notification", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint"),
  notificationJson: json("notification_json").$type<PushSubscriptionJSON>() // use .$type<PushSubscriptionJSON>() if needed
});
