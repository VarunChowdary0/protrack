export enum FileType{
    PDF = "pdf",
    DOCX = "docx",
    PPTX = "pptx",
    PPT = "ppt",
    XLSX = "xlsx",
    XLS = "xls",
    TXT = "txt",
    PNG = "png",
    JPG = "jpg",
    JPEG = "jpeg",
    GIF = "gif",
    MP4 = "mp4",
    MP3 = "mp3",
    DOC = "doc",
    OTHER = "other",
    ZIP = "zip",
}

export interface DocumentType{
    id: string;
    name: string;
    description: string;
    filePath: string;
    fileType: FileType;
    createdAt?: string;
    updatedAt?: string;
}