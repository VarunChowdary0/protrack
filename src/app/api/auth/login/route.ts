import { db } from "@/db/drizzle";
import { access } from "@/db/Schema/AccessSchema";
import { users } from "@/db/Schema/UserSchema";
import { User } from "@/types/userTypes";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { email, password, mode }:{
            email: string;
            password: string;
            mode: "OAuth" | "Credentials";
        } = body;
        // console.log(body);
        let res;
        if(mode === "OAuth"){
            if(!email){
                return new Response(JSON.stringify({ error: "Email is required for OAuth login" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
            else{
                res = await db.select().from(users)
                            .where(eq(users.email,email));
                if(res.length === 0){
                    return new Response(JSON.stringify({ message: "New User" }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }
        }
        else if(mode === "Credentials"){
            if(!email || !password){
                return new Response(JSON.stringify({ error: "Email and password are required for Credentials login" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }
            else{
                res = await db.select().from(users)
                            .where(and(eq(users.email,email),eq(users.password,password)));
                if(res.length === 0){
                    return new Response(JSON.stringify({ error: "Invalid email or password" }), {
                        status: 401,
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }
        }

        if(!res || res.length === 0){
            return new Response(JSON.stringify({ error: "User not found" }));
        }


        const [accessData] = await db.select().from(access).where(eq(access.userRole, res[0].role)).limit(1);
        const sanitizedAccess = {
          ...accessData,
          createOrganization: accessData?.createOrganization ?? false,
          accessOrganization: accessData?.accessOrganization ?? false,
          manageOrganization: accessData?.manageOrganization ?? false,
          createOrganizationManagers: accessData?.createOrganizationManagers ?? false,
          accessOrganizationManagers: accessData?.accessOrganizationManagers ?? false,
          createOrganizationUsers: accessData?.createOrganizationUsers ?? false,
          accessOrganizationUsers: accessData?.accessOrganizationUsers ?? false,
          accessProjects: accessData?.accessProjects ?? false,
          createProjects: accessData?.createProjects ?? false,
          editProjects: accessData?.editProjects ?? false,
          deleteProjects: accessData?.deleteProjects ?? false,
          accessTeam: accessData?.accessTeam ?? false,
          mapTeam: accessData?.mapTeam ?? false,
          accessTimeline: accessData?.accessTimeline ?? false,
          manageTimeline: accessData?.manageTimeline ?? false,
          accessActivities: accessData?.accessActivities ?? false,
          manageActivities: accessData?.manageActivities ?? false,
          accessResources: accessData?.accessResources ?? false,
          manageResources: accessData?.manageResources ?? false,
          deleteResources: accessData?.deleteResources ?? false,
          accessTasks: accessData?.accessTasks ?? false,
          hold_cancle_tasks: accessData?.hold_cancle_tasks ?? false,
          assignTasks: accessData?.assignTasks ?? false,
          accessCalendar: accessData?.accessCalendar ?? false,
          manageCalendar: accessData?.manageCalendar ?? false,
          accessChat: accessData?.accessChat ?? false,
          createGroups: accessData?.createGroups ?? false,
          manageGroups: accessData?.manageGroups ?? false,
        };

        // console.log(accessData)


        const UserData:User = {
            id: res[0].id,
            firstname: res[0].firstname,
            lastname: res[0].lastname,
            email: res[0].email,
            profilePicture: res[0].profilePicture || "",
            phoneNumber: res[0].phoneNumber || "",
            isEmailVerified: res[0].isEmailVerified || false,
            role: res[0].role,
            organizationId: res[0].organizationId || "",
            isActive: res[0].isActive || true,
            lastLogin: res[0].lastLogin || "",
            isPhoneVerified: res[0].isPhoneVerified || false,
            access: sanitizedAccess,
            lastEmailChange: res[0].lastEmailChange || "",
            lastPasswordChange: res[0].lastPasswordChange || "",
            lastPhoneChange: res[0].lastPhoneChange || "",

        }
                            
        return new Response(JSON.stringify({
            message: "login successful",
            UserData
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    }
    catch(e){
        console.error("Error in login route:", e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}