// app/api/register/user/route.ts
import { db } from "@/db/drizzle";
import { users } from "@/db/Schema/UserSchema";
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
      password,
      profilePicture,
      phoneNumber,
      isEmailVerified,
    });

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
