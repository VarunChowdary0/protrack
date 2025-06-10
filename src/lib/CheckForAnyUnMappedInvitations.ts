import { db } from "@/db/drizzle"
import { invitations } from "@/db/Schema/InvitationSchema"
import { and, eq } from "drizzle-orm"

const CheckForAnyUnMappedInvitations = async (email: string) => {
    const unMappedInvitations = await db.select()
                                    .from(invitations)
                                    .where(
                                        and(
                                            eq(invitations.toEmail, email),
                                            eq(invitations.mappedAt, "")
                                        )
                                    );
    return unMappedInvitations;
}

export default CheckForAnyUnMappedInvitations;