"use client";

import React from 'react'
import { 
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Forward,
  MoreVertical,
  Reply,
  StarIcon,
  Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { Inbox } from '@/types/inboxType';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ViewAttachment from './ViewAttachment';

interface MessageViewerProps {
  message: Partial<Inbox>;
  handleArchiveItem: (id: string) => void;
  handleTrashItem: (id: string) => void;
  handleStarToggle: (id: string) => void;
  onReply?: (email: string, subject: string) => void;
}

const MessageViewer: React.FC<MessageViewerProps> = ({ 
  message,
  handleStarToggle,
  handleArchiveItem,
    handleTrashItem,
  onReply 
}) => {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };



  return (
    <div className="h-[calc(100vh-60px)] relative max-sm:mt-12 max-sm:mb-20 w-full max-w-screen overflow-auto">
      {/* Gmail-style toolbar - Mobile responsive */}
      <div style={{
        zIndex: 2000
      }} className="border-b max-sm:fixed pt-2 max-sm:pt-0 top-0 left-0 right-0 z-10 bg-card">
        <div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button onClick={() => router.back()} variant="ghost" size="sm" className="p-1 sm:p-2">
              <ArrowLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={()=>handleArchiveItem(message.id || "")}>
              {
                message.isArchived ?
                <ArchiveRestore size={16} className="text-yellow-500" /> :
                <Archive size={16} className="text-muted-foreground" />
              }
            </Button>
            <Button variant="ghost" size="sm" onClick={()=> handleTrashItem(message.id || "")}>
              <Trash2 size={16} />
            </Button>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleStarToggle(message.id || "")}
                >
                  <StarIcon 
                    size={18} 
                    className={`cursor-pointer
                    ${message.isStarred ? "text-yellow-400" : "text-muted-foreground"}`}
                    fill={message.isStarred ? "currentColor" : "none"}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="!text-xs">
                {message.isStarred ? "Unstar" : "Star"}
              </TooltipContent>
            </Tooltip>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 sm:p-2"
              onClick={() => onReply && onReply(message.fromUser?.email || "", message.title || "")}
              disabled={!onReply}
            >
              <Reply className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Reply</span>
            </Button>
            <Button disabled variant="ghost" size="sm" className="p-1 sm:p-2">
              <Forward className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Forward</span>
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
        <div className="mx-auto overflow-y-auto">
          {/* Message header - Mobile responsive */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b">
            <div className="flex items-start gap-3 sm:gap-4">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                <AvatarImage 
                  src={message.fromUser?.profilePicture || ''} 
                  alt={`${message.fromUser?.firstname || ''} ${message.fromUser?.lastname || ''}`} 
                />
                <AvatarFallback className="font-medium text-xs sm:text-sm">
                  {message.fromUser?.firstname ? getInitials(`${message.fromUser.firstname} ${message.fromUser.lastname || ''}`) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-start sm:items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-xl font-normal leading-tight">
                      {message.title || 'No Subject'}
                    </h1>
                    {message.type && (
                      <Badge variant="secondary" className="text-xs">
                        {message.type}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {message.timestamp && format(new Date(message.timestamp), 
                      window.innerWidth < 640 ? 'MMM d, yyyy' : 'MMM d, yyyy, h:mm a')}
                  </span>
                </div>
                <div className="flex flex-wrap flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                      {message.fromUser?.firstname ? `${message.fromUser.firstname} ${message.fromUser.lastname || ''}` : message.fromUser?.email || 'Unknown Sender'}
                    </span>
                    <span className="text-muted-foreground truncate">
                      &lt;{message.fromUser?.email}&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">to</span>
                    <span className="font-medium truncate">{auth.user?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message content - Mobile responsive */}
          <div className="px-3 sm:px-6 py-4 sm:py-6">
            <pre className="prose prose-sm sm:prose max-w-none">
              {message.description}
            </pre>

            {/* Attachments section (if needed) */}
            {message.attachments && message.attachments.length > 0 && (
               <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Attachments
                </h3>

                <div className=" flex flex-wrap max-sm:justify-between gap-4">
                  {message.attachments.map((attachment, index) => {
                    const doc = attachment.document;

                    return doc ? (
                      <div key={index} className="border rounded-md">
                        <ViewAttachment document={doc} />
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="p-4 border rounded-md bg-muted text-sm text-muted-foreground"
                      >
                        {`Attachment ${index + 1} not available`}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message metadata/timeline */}
            <details className="mt-6">
              <summary className="cursor-pointer text-xs sm:text-sm hover:bg-muted p-2 rounded flex items-center gap-2">
                View details
              </summary>
              <div className="mt-3 pl-2 sm:pl-6 space-y-2 text-xs sm:text-sm">
                {[
                  { label: 'Sent', date: message.timestamp },
                  { label: 'Updated', date: message.updatedAt },
                  { label: 'Read', date: message.seenAt }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 py-1 border-b border-muted last:border-b-0">
                    <span className="text-muted-foreground font-medium">{item.label}</span>
                    <span className="font-mono text-xs sm:text-sm">
                      {item.date ? format(new Date(item.date), 
                        window.innerWidth < 640 ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy HH:mm'
                      ) : 'Not available'}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
    </div>
  );
}

export default MessageViewer;