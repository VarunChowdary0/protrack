import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    logo: text("logo").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),

});