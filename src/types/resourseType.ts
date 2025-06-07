import { FileType } from "./timelineType";


export interface Resourse{
    id: string;
    taskId: string;
    name: string;
    description: string;
    filePath: string;
    fileType: FileType; 
    createdAt: string; 
    updatedAt: string; 
}