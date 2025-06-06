"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowUp, ChevronLeftIcon, FileIcon, Image, Paperclip } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDispatch } from 'react-redux';
import { setChatOpen, setHideBottomBar } from '@/redux/reducers/BooleanReducer';

const MockMessages = [
    {
        id: 1,
        sender: "Alex Thompson",
        content: "Hello! How are you?",
        timestamp: "2025-05-29T10:00:00Z"
    },
    {
        id: 2,
        sender: "You",
        content: "I'm good, thanks! How about you?",
        timestamp: "2025-05-29T10:01:00Z"
    },
    {
        id: 3,
        sender: "Alex Thompson",
        content: "Doing well, just busy with work.",
        timestamp: "2025-05-29T10:02:00Z"
    },
    {
        id: 4,
        sender: "You",
        content: "Same here! Any plans for the weekend?",
        timestamp: "2025-05-29T10:03:00Z"
    },
    {
        id: 5,
        sender: "Alex Thompson",
        content: "Thinking of going hiking. How about you?",
        timestamp: "2025-05-29T10:04:00Z"
    },
    {
        id: 6,
        sender: "You",
        content: "That sounds great! I might join you.",
        timestamp: "2025-05-29T10:05:00Z"
    },
    {
        id: 7,
        sender: "Alex Thompson",
        content: "Awesome! Let's plan it out.",
        timestamp: "2025-05-29T10:06:00Z"
    },
    {
        id: 8,
        sender: "You",
        content: "Sure! I'll bring some snacks.",
        timestamp: "2025-05-29T10:07:00Z"
    },
    {
        id: 9,
        sender: "Alex Thompson",
        content: "Perfect! Looking forward to it.",
        timestamp: "2025-05-29T10:08:00Z"
    },
    {
        id: 10,
        sender: "You",
        content: "Me too! See you then.",
        timestamp: "2025-05-29T10:09:00Z"
    }
]

const IndividualChat:React.FC = () => {
    const dispatch = useDispatch();
    const {chat_id} = useParams<{chat_id: string}>();
    const [messages, setMessages] = React.useState<{
        id: number,
        sender: string,
        content: string,
        timestamp: string
    }[]>([]);
    const router = useRouter();

    const [inputValue, setInputValue] = React.useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "instant" });
    }
    setMessages(MockMessages);

    dispatch(setChatOpen(true));
    dispatch(setHideBottomBar(true));
  }, []);
  
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const SendMessage = (message: string) => {
    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
    setInputValue(""); // Clear input after sendin
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }


    return (
    <Card className='w-full max-sm:!px-0 !gap-0 !border-0 max-sm:z-[4000] !shadow-none !rounded-none'>
        <CardHeader className=' shadow pb-2 max-sm:!px-2 !gap-3 flex items-center h-full '>
            <div onClick={()=>router.back()} className=' hover:bg-secondary p-1 rounded-full'>
                <ChevronLeftIcon/>
            </div>
            <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?img=${chat_id||1}`} />
                <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className=' flex flex-col gap-0'>
                <h2 className='text-lg font-semibold'>Alex Thompson</h2>
                <p className='text-xs text-muted-foreground'>lastseen 29 May 2025</p>
            </div>
        </CardHeader>
        <CardContent className=' max-sm:!px-0 h-[calc(100vh-9.5rem+10px)] max-sm:h-[h-[calc(100vh-15rem)]] flex items-center justify-center'>
            {
                messages.length > 0 ? 
                <div className=' h-full w-full mybar overflow-y-auto'>
                    {
                        messages.map((message) => (
                            <div key={message.id} className={`p-4 ${message.sender === "You" ? "text-right" : "text-left"}`}>
                                <div className={`inline-block px-4 py-2 rounded-lg ${message.sender === "You" ? "bg-primary dark:text-black text-white" : "bg-secondary dark:text-white"}`}>
                                    <p className='text-sm'>{message.content}</p>
                                    <span className='text-xs text-gray-500 block mt-1'>{new Date(message.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))
                    }
                    <div ref={bottomRef} ></div>
                </div>
                :
                <div className='  text-sm text-center'>
                    <p className=' text-2xl'>Start a conversation with Alex Thompson</p>
                    <p className='text-muted-foreground mt-2'>Type your message below to begin chatting.</p>
                </div>
            }
        </CardContent>
        <CardFooter
            ref={chatContainerRef}
            className=' relative px-10 max-sm:px-5'>
            <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim() !== "") {
                        e.preventDefault(); // Prevent form submission
                        SendMessage(inputValue);
                    } 
                }}
                placeholder='Type your message...'
                className=' h-12 pl-5 pr-24 rounded-2xl'
                spellCheck={false}
                autoComplete='off'
                autoCorrect='off'
                type='text'
                maxLength={5000}
                minLength={1}
            />
            <Popover>
                <PopoverTrigger className=' absolute right-28 max-sm:right-20'>
                    <Paperclip size={16}/>
                </PopoverTrigger>
                <PopoverContent className=' !w-fit !p-3 mb-10 mr-10'>
                    <div className=' text-xs w-full h-full flex gap-3'>
                        <span className=' flex items-center flex-col text-muted-foreground hover:text-foreground cursor-pointer'>
                            <FileIcon size={16} className='' />
                            Documents
                        </span>
                        <div className=' w-0.5 rounded-2xl bg-secondary'></div>
                        <span className=' flex items-center flex-col text-muted-foreground hover:text-foreground cursor-pointer'>
                            <Image size={16} className='' />
                            Images
                        </span>
                    </div>
                </PopoverContent>
            </Popover>
            <Button 
                disabled={inputValue.trim() === ""}
                onClick={()=>SendMessage(inputValue)} 
                className=' absolute right-16 max-sm:right-8 top-1/2 text-secondary -translate-y-1/2 !p-2 !h-fit !rounded-full bg-primary'>
                <ArrowUp className=' ' size={20} />
            </Button>
        </CardFooter>
    </Card>
  )
}

export default IndividualChat