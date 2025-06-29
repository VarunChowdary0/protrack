import { DocumentType } from "./documentType";

export enum TimelineEventType {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    POSTPONED = "POSTPONED",
}

export interface RequiredDocument {
    id: string;
    timelineId: string;
    referenceDocumentId: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    referenceDocument?: DocumentType;
}

export interface DocumentSubmission{
    id: string;
    timelineId: string;
    submittedById: string;
    documentId: string;
    remarks?: string;
    reviewedAt?: string;
    reviewedById?: string;
    createdAt: string;
    updatedAt: string;
    document?: DocumentType;
}

export interface Timeline {
    id: string;
    projectId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    verifiedDocuments: number;
    totalDocuments: number;
    status: TimelineEventType;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
    requiredDoucments?: RequiredDocument[]; 
    documentSubmissions?: DocumentSubmission[]; 
}
