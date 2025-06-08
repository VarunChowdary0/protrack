import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { organizations } from "./Organization.Schema";
import { UserRole } from "@/types/userTypes";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    firstname: text("first_name").notNull(),
    lastname: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    organizationId: text("organization_id").references(() => organizations.id, { onDelete: "cascade" })
                                            .notNull()
                                            .default('1'), // made nullable with default empty string
    role: text("role").notNull().$type<UserRole>().default(UserRole.USER), // default role is USER
    createdAt: text("created_at").default(new Date().toISOString()).notNull(),
    updatedAt: text("updated_at").default(new Date().toISOString()).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isEmailVerified: boolean("is_email_verified").notNull().default(false), // send otp to email
    isPhoneVerified: boolean("is_phone_verified").notNull().default(false), // send otp to phone
    phoneNumber: text("phone_number").notNull().default(""),
    profilePicture: text("profile_picture").notNull().default(""), // URL to the profile picture
    lastLogin: text("last_login").notNull().default(""), // timestamp of the last login
    lastPasswordChange: text("last_password_change").notNull().default(""), // timestamp of the last password change
    lastEmailChange: text("last_email_change").notNull().default(""), // timestamp of the last email change
    lastPhoneChange: text("last_phone_change").notNull().default(""), // timestamp of the last phone number change
})