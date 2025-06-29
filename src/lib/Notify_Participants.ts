import { getProject } from "./GetProject";
import send_Notification from "./SendNotification";

export async function notifyParticipants(projectId: string, payload: {
    title: string;
    body: string;
    url?: string;
    icon?: string;
    image?: string;
    badge?: string;
    data?: Record<string, unknown>;
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    vibrate?: number[];
    timestamp?: number;
    actions?: Array<{ action: string; title: string; icon?: string }>;
    renotify?: boolean;
}) {
    const projectDetails = await getProject(projectId);
    if(!projectDetails) {
        console.error("Project not found");
        return;
    }
    if(!payload){
        console.error("Payload is empty or undefined");
        return;
    }
    const projectParticants = (projectDetails.participants?.map(participant => participant.userId) || []).filter((id): id is string => id !== undefined);
    if (projectParticants.length > 0) {
        console.log(`Notifying participants of project ${projectId}:`, projectParticants);
        const newPayload = {
            ...payload,
            userIds: projectParticants
        }
        send_Notification(newPayload);
    }
    else{
        return;
    }
}
