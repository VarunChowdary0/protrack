
export enum activityStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
} 

export interface Activity{
    id: string;
    projectId: string;
    date: string; // ISO date string
    status: activityStatus;
    title: string;
    description: string;
    location: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}