// app/api/register/user/route.ts
import { db } from "@/db/drizzle";
import { users } from "@/db/Schema/UserSchema";
import CheckForAnyUnMappedInvitations from "@/lib/CheckForAnyUnMappedInvitations";
import MapInvitation from "@/lib/MapInvitation";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstname,
      lastname,
      email,
      password,
      profilePicture,
      phoneNumber,
      isEmailVerified,
    } = body;

    if (!firstname || !lastname || !email || !password) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.insert(users).values({
      id: uuid(),
      firstname,
      lastname,
      email,
      password,  // implemant hashing.
      profilePicture,
      phoneNumber,
      isEmailVerified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // look for waiting invitations for this email
    const waitingInvitations = await CheckForAnyUnMappedInvitations(email);
    if (waitingInvitations.length > 0) {
      // If there are waiting invitations, you can handle them here
      console.log(`Found ${waitingInvitations.length} waiting invitations for ${email}`);
      await Promise.all(waitingInvitations.map(invitation => 
        MapInvitation({
          id: invitation.id || "",
          toEmail: invitation.toEmail || "",
          formId: invitation.formId || "",
          projectId: invitation.projectId || "",
          subject: invitation.subject || "Invitation",
          message: invitation.message || "You have been invited to join the organization",
        })
      ));
    }
    

    return new Response(JSON.stringify({ message: "User registered successfully" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /register/user:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
