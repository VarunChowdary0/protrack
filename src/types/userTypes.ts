export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    SUPER_ADMIN = "super_admin",
}

export interface User {
    id: string;
    firatname: string;
    lastname: string;
    email: string;
    organizationId: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    phoneNumber?: string; // Optional, as not all users may have a phone number
    profilePicture?: string; // Optional, as not all users may have a profile picture
    lastLogin?: string; // Optional, as not all users may have a last login timestamp
    lastPasswordChange?: string; // Optional, as not all users may have a last password change timestamp
    lastEmailChange?: string; // Optional, as not all users may have a last email change timestamp
    lastPhoneChange?: string; // Optional, as not all users may have a last phone number change timestamp
}