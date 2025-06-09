export enum TimelineEventType {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    POSTPONED = "POSTPONED",
}

export enum FileType{
    PDF = "pdf",
    DOCX = "docx",
    PPTX = "pptx",
    XLSX = "xlsx",
    TXT = "txt",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    OTHER = "other",
    ZIP = "zip",
}

export interface DocumentType{
    id: string;
    timelineId: string;
    name: string;
    description: string;
    filePath: string;
    fileType: FileType;
}

export interface Timeline {
    id: string;
    projectId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    totalDocuments: number;
    status: TimelineEventType;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
    doucments?: DocumentType[];  
}
