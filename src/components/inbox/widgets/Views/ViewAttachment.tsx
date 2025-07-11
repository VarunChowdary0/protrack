'use client';

import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { DocumentType, FileType } from '@/types/documentType';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ViewAttachmentProps {
  document: DocumentType;
}

const ViewAttachment: React.FC<ViewAttachmentProps> = ({ document }) => {
  const fileUrl = document.filePath;
  const fileName = document.name;

  const isImage = [FileType.JPG, FileType.PNG, FileType.GIF, FileType.WEBP].includes(document.fileType);
  const isPDF = document.fileType === FileType.PDF;

  return (
    <div className=' flex flex-col w-[200px] max-sm:w-[180px] rounded h-[120px] border'>
        <div className=' h-[90px] overflow-hidden w-full flex  items-center justify-center'>
             {isImage && (
                <img
                    src={fileUrl}
                    alt={fileName}
                    className="object-cover w-full h-full"
                />
                )}

                {isPDF && (
                <div className="text-sm font-bold dark:text-black text-white bg-[#f2f2f2] border py-2 px-1 rounded">
                    PDF
                </div>
                )}

                {!isImage && !isPDF && (
                <div className="text-xs text-muted-foreground text-center px-2">
                    Preview not available
                </div>
                )}
        </div>
        <div className=' h-[30px] bg-secondary pt-1 w-full flex px-2'>
            
            <div className=' flex-2/3 max-w-[150px] max-sm:max-w-[100px] truncate'>
                <Tooltip>
                    <TooltipTrigger>
                    <span className=' overflow-x-hidden text-sm '>
                        {fileName}
                    </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{fileName}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className=' flex-1/3 '>
                <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Download className="h-4 w-4" />
                    </Button>
                </a>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ExternalLink className="h-4 w-4" />
                </Button>
                </a>
            </div>
        </div>
    </div>
  );
};

export default ViewAttachment;
