import { Participant } from "./participantType";

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ON_HOLD = "ON_HOLD",
    CANCELLED = "CANCELLED",
}
export interface Task{
    id: string;
    projectId: string;
    title: string;
    description: string;
    dueDate: string;
    assignedTo_id: string;
    assignedTo?: Participant;
    assignedBy_id: string;
    assignedBy?: Participant
    isPlanned: boolean;
    isImportant: boolean;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
    completedAt: string;
    priority: number;
}


