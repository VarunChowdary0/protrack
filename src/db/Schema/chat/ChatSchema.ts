import { pgTable, text } from "drizzle-orm/pg-core";
import { participants } from "../ParticipantSchema";

export const chats = pgTable("chats", {
    id: text("id").primaryKey(),
    userID_1: text("user_id_1").references(()=> participants.id, { onDelete: "cascade"}), // ID of the first user in the chat
    userID_2: text("user_id_2").references(()=> participants.id, { onDelete: "cascade"}), // ID of the second user in the chat
});