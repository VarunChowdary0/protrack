"use client";

import { Button } from '@/components/ui/button';
import { Paperclip, Image, Link2, MoreVertical, Send, Trash2, XIcon, FileText } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/userTypes';
import axiosInstance from '@/config/AxiosConfig';

interface ComposeMailProps {
    closeCompose: () => void;
    replyTo?: string;
    subject?: string;
}

const ComposeMail: React.FC<ComposeMailProps> = ({ closeCompose, replyTo, subject }) => {
  const [suggestions, setSuggestions] = useState<Partial<User>[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Partial<User>[]>([]);
  const [sending, setSending] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    to: replyTo || '',
    cc: '',
    bcc: '',
    subject: subject ? `Re: ${subject}` : '',
    message: '',
    attachments: attachments
  });
  
  const [minimized, setMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFileSize = 10 * 1024 * 1024; // 10MB limit
    const maxFiles = 5; // Maximum 5 files

    if (attachments.length + files.length > maxFiles) {
      toast.error(`You can only attach up to ${maxFiles} files`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        toast.error(`File "${file.name}" is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles]
      }));
      toast.success(`${validFiles.length} file(s) attached`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = prev.filter((_, i) => i !== index);
      setFormData(prevData => ({
        ...prevData,
        attachments: newAttachments
      }));
      return newAttachments;
    });
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const handleSend = async () => {
    if (!formData.subject) {
      toast.error("Subject is required");
      return;
    }
    if (!formData.message) {
      toast.error("Message is required");
      return;
    }
    await sendEmail();
  };

  const formatRecipients = (emails: string) => {
    return emails.split(',').map(email => email.trim()).join(', ');
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (formData.to.length < 2) {
        return;
      }
      try {
        const response = await axiosInstance.get('/api/get/tomail-suggestions', {
          params: {
            query: formData.to.trim()
          }
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [formData.to]);

  const filterSeen = suggestions.filter((ele) => {
    return !selectedRecipients.some((rec) => rec.email === ele.email);
  });

  const sendEmail = async () => {
    const tos = selectedRecipients.map(rec => rec.id);
    setSending(true);
    
    try {
      // Create FormData for file uploads
      const emailData = new FormData();
      emailData.append('toIds', JSON.stringify(tos));
      emailData.append('subject', formData.subject);
      emailData.append('text', formData.message);
      
      // Append attachments
      attachments.forEach((file) => {
        emailData.append(`attachments`, file);
      });

      const response = await axiosInstance.post('/api/manage/send/mail', emailData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Email sent successfully:", response.data);
      toast.success("Email sent successfully!");
      closeCompose();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  if (minimized) {
    return (
      <Card className="fixed bottom-0 right-4 w-80 shadow-lg">
        <div className="p-3 flex items-center justify-between bg-primary text-primary-foreground cursor-pointer"
             onClick={() => setMinimized(false)}>
          <span className="font-medium truncate">
            {formData.subject || 'New Message'}
          </span>
          <div className="flex items-center gap-2">
            {attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <Paperclip className="h-3 w-3" />
                {attachments.length}
              </div>
            )}
            <XIcon className="h-4 w-4 hover:text-primary-foreground/80" 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeCompose();
                  }} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] max-sm:pb-16 relative max-sm:mt-12 max-sm:mb-20 w-full max-w-screen overflow-auto">
      <div style={{ zIndex: 2000 }} 
           className="border-b max-sm:fixed pt-2 max-sm:pt-0 top-0 left-0 right-0 z-10 bg-card">
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold">New Message</h2>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="sm" 
                        onClick={() => setMinimized(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Minimize</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="sm" onClick={closeCompose}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto overflow-y-auto p-4 max-sm:px-1">
        <div className="space-y-4">
          {/* Recipients */}
          <div className="space-y-2">
            <div className='w-full min-h-fit flex flex-wrap gap-2 p-2'>
                {selectedRecipients.length > 0 &&
                    selectedRecipients.map((recipient, idx) => (
                        <div key={idx} className='flex items-center gap-2 bg-muted rounded-lg px-2 py-1'>
                            <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage src={recipient.profilePicture} alt={"PROFILE"} />
                                <AvatarFallback className="font-medium text-xs">
                                    {(recipient.firstname?.charAt(0) ?? '') + (recipient.lastname?.charAt(0) ?? '')}
                                </AvatarFallback>
                            </Avatar>
                            <span className='text-sm font-medium'>{recipient.firstname + " " + recipient.lastname}</span>
                            <XIcon className='h-4 w-4 cursor-pointer hover:text-destructive' onClick={() => {
                                setSelectedRecipients(prev => prev.filter((_, i) => i !== idx));
                            }} />
                        </div>
                    ))
                }
            </div>
            <div className="flex w-full items-center relative gap-2">
            <Input
                placeholder="Recipients"
                value={formData.to}
                onChange={(e) => handleInputChange('to', formatRecipients(e.target.value))}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              {
                (filterSeen.length > 0 && showSuggestions) && 
                <div className=' absolute w-[400px] max-h-[60vh] border top-12 flex flex-col bg-card h-fit py-2 rounded-md'>
                    {
                        filterSeen.map((ele,idx)=>
                            <div key={idx}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={()=>{
                                    setSelectedRecipients(prev => [...prev, ele]);
                                    handleInputChange('to', formatRecipients(""));
                                }
                            }
                            className=' w-full px-2 py-1 hover:bg-muted-foreground/10 hover:cursor-pointer flex gap-2 items-center'>
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                    <AvatarImage src={ele.profilePicture} alt={"PROFILE"} />
                                    <AvatarFallback className="font-medium text-xs sm:text-sm">
                                        {(ele.firstname?.charAt(0) ?? '') + (ele.lastname?.charAt(0) ?? '')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className=' flex flex-col items-start'>
                                    <span className=' font-semibold'>{ele.firstname+ " "+ ele.lastname}</span>
                                    <span className=' text-xs'>{ele.email}</span>
                                </div>
                            </div>
                        )
                    }
                </div>
              }
            </div>
          </div>

          <Separator />
          
          {/* Subject */}
          <Input
            placeholder="Subject"
            value={formData.subject}
            className="flex-1 border-0 text-xl max-sm:text-lg font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => handleInputChange('subject', e.target.value)}
          />

          <Separator />

          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 flex-wrap">
            <Separator orientation="vertical" className="h-6" />
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="sm">
                  <Link2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert link</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert image</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach files</TooltipContent>
            </Tooltip>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              // accept="*/*"
            />
          </div>

          {/* Attachments Display */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Attachments ({attachments.length})
              </div>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message body */}
          <Textarea
            placeholder="Write your message here..."
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className="min-h-[300px] h-[100%] max-sm:min-h-[440px] resize-none flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleSend}
                disabled={sending}
                className="px-6"
              >
                {sending ? (
                  <>
                    <span className="mr-2">Sending</span>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                    {attachments.length > 0 && (
                      <span className="ml-1 text-xs">({attachments.length})</span>
                    )}
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={closeCompose}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComposeMail;