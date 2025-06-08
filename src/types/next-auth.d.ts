// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { Access } from "./accessType";
import { UserRole } from "./userTypes";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      organizationId: string;
      role: UserRole;
      isActive: boolean;
      isEmailVerified?: boolean;
      isPhoneVerified?: boolean;
      access: Access;
      phoneNumber?: string;
      profilePicture?: string;
      lastLogin?: string;
    } & DefaultSession["user"];
    isNewUser?: boolean;
  }

  // interface User extends Session["user"] {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
