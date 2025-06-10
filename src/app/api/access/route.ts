import { db } from "@/db/drizzle";
import { access } from "@/db/Schema/AccessSchema";
import { admin, orgManager, orgUser, userAccess } from "@/lib/UserAccesses";

export async function GET() {
  try {
    await db.insert(access).values([
        userAccess,
        orgUser,
        orgManager,
        admin,
    ]);

    return new Response(JSON.stringify("Access Uploaded"), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error in GET /api/access:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
