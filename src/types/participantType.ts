import { User } from "./userTypes";


export interface Participant{
    id: string;
    userId: string;
    projectId: string;
    isLead: boolean;
    isTeamMember: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
}