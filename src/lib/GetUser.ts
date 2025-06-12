import { db } from "@/db/drizzle";
import { participants } from "@/db/Schema/ParticipantSchema";
import { users } from "@/db/Schema/UserSchema";
import { Participant } from "@/types/participantType";
import { User } from "@/types/userTypes";
import { and, eq } from "drizzle-orm";
import { admin, orgManager, orgUser, userAccess } from "./UserAccesses";

export async function getUser(
                                userId: string, 
                                projectId?: string,
                            ): Promise<{
                                user: Partial<User>;
                                isParticipant?: boolean;
                                participant?: Partial<Participant>,
                        }> {
    if(!userId){
        throw new Error("User ID is required");
    }
    console.log("Fetching user with ID:", userId);
    const user = await db.select({
        id: users.id,
        firstName: users.firstname,
        lastName: users.lastname,
        email: users.email,
        profilePicture: users.profilePicture,
        role: users.role,
        isActive: users.isActive,
        isEmailVerified: users.isEmailVerified,
        isPhoneVerified: users.isPhoneVerified,
        organizationId: users.organizationId,
        userStatus: users.userStatus,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        lastPasswordChange: users.lastPasswordChange,
        lastEmailChange: users.lastEmailChange,
        lastPhoneChange: users.lastPhoneChange,
        phoneNumber: users.phoneNumber,
        isOnline: users.isActive
    }).from(users).where(eq(users.id,userId)).limit(1);
    if (user.length === 0) {
        return {
            user: {},
            isParticipant: false,
            participant: undefined
        }
    }
    console.log("User found:", user[0].firstName);
    const accessUser:Partial<User> = {
        ...user[0],
        access: [userAccess,orgUser,orgManager,admin]
                    .filter(access => access.userRole === user[0].role)[0]
    }
    // console.log("Access User:", accessUser.access?.userRole);
    if (!user[0]) {
        throw new Error("User not found");
    }
    if(!projectId){
        // asking for direct user
        return {
            user: accessUser,
            isParticipant: false,
            participant: undefined
        };
    }
    else{
        // asking for user in a project
        const participant = await db.select().from(participants).where(
            and(
                eq(participants.userId, userId),
                eq(participants.projectId, projectId)
            )
        );
        console.log("Participant found:", participant.length);
        const mappedParticipant = participant[0] ? {
            ...participant[0],
            userId: participant[0].userId ?? undefined,
            projectId: participant[0].projectId ?? undefined
        } : undefined;
        return {
            user: accessUser,
            isParticipant: participant.length > 0,
            participant: mappedParticipant
        }
    }
}