import { db } from "@/db/drizzle";
import { participants } from "@/db/Schema/ParticipantSchema";
import { tasks } from "@/db/Schema/project/TaskSchema";
import { getUser } from "@/lib/GetUser";
import send_Notification from "@/lib/SendNotification";
import { TaskStatus } from "@/types/taskTypes";
import { eq } from "drizzle-orm";

export async function POST(request:Request) {
    try{   
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("USER_ID ")) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        const userId = authHeader.split(" ")[1];
        const reqFromUser = await getUser(userId);
        if (!reqFromUser || !reqFromUser.user || !reqFromUser.user.id) {
            return new Response(JSON.stringify({ error: "User not found", action: "LOGOUT" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        const body = await request.json();
        const {
            projectId,
            title,
            description,
            dueDate,
            assignedTo_id,
            assignedBy_id,
            isPlanned,
            isImportant,
            createdAt,
            updatedAt,
            priority,
        } = body;
        if(!projectId || !title || !description ||
             !dueDate || !assignedBy_id || !assignedTo_id ){
            return new Response(JSON.stringify({ error: "Missing Parameters" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        const newTask = await db.insert(tasks).values({
            id: crypto.randomUUID(),
            projectId,
            title,
            description,
            dueDate,
            // assignedTo_id:"89e9c2e6-095c-470f-8026-c9d636021aca",
            assignedTo_id,
            assignedBy_id,
            isPlanned,
            isImportant,
            status: TaskStatus.PENDING,
            createdAt,
            updatedAt,
            priority
        }).returning();
        
        if(assignedBy_id !== assignedTo_id){
            const [assignedUser] = await db.select().from(participants).where(eq(participants.id,assignedTo_id));
            await send_Notification({
                userIds: [assignedUser.userId],
                title: `${title} assigned by ${reqFromUser.user.firstname}`,
                body: description,
                url: `${projectId}/todos/all`,
                icon: reqFromUser.user.profilePicture,
                image: reqFromUser.user.profilePicture,
                data: {
                    "Priority": priority,
                    "Important": isImportant
                },
                renotify: true
            });
        }
        return new Response(JSON.stringify(newTask[0]), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch(error){
        console.error("Error in UPDATE /manage/user/change_password:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}