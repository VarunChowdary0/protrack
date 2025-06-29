import { DocumentType } from "./documentType";


export interface Resource{
    id: string;
    projectId: string;
    ownerId: string;
    documentId: string;
    createdAt?: string;
    updatedAt?: string;
    document?: DocumentType
}