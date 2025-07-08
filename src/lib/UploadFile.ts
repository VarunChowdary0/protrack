import { db } from "@/db/drizzle";
import { documents } from "@/db/Schema/DoumentSchema";
import { DocumentType, FileType } from "@/types/documentType";

interface UploadFileParams {
  name: string;
  description: string;
  fileType: FileType;
  file: File | null; // optional for mock
}
// also try to compress the file before uploading
export async function uploadFile(data: UploadFileParams): Promise<DocumentType> {
  if (!data.name || !data.description || !data.fileType) {
    throw new Error("Name, description, and file type are required.");
  }

//   const file = data.file;

  const mockFiles: Record<FileType, string> = {
    pdf: "/mock/file.pdf",
    doc: "/mock/file.doc",
    docx: "/mock/file.docx",
    pptx: "/mock/file.pptx",
    ppt: "/mock/file.ppt",
    xlsx: "/mock/file.xlsx",
    xls: "/mock/file.xls",
    txt: "/mock/file.txt",
    png: "/mock/file.png",
    jpg: "/mock/file.jpg",
    jpeg: "/mock/file.jpeg",
    webp: "/mock/file.webp",
    gif: "/mock/file.gif",
    mp4: "/mock/file.mp4",
    mp3: "/mock/file.mp3",
    other: "/mock/file",
    zip: "/mock/file.zip",
  };

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const [metadata] = await db.insert(documents).values({
    id,
    name: data.name,
    description: data.description,
    filePath: mockFiles[data.fileType],
    fileType: data.fileType,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return {
    id: metadata.id,
    name: metadata.name,
    description: metadata.description,
    filePath: metadata.filePath,
    fileType: metadata.fileType,
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
  };
}
