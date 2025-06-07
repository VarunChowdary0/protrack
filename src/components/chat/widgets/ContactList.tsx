"use client";

import React, { useEffect } from 'react'
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChangeThemeColor from '@/lib/ChangeThemeColor';

const MockTeamMembers = [
    {
        name: "Alex Thompson",
        latestMessage: {
            msg: "Can you review the new API integration?",
            seen: false,
            time: "10:30 AM"
        },
        isSeen: false
    },
    {
        name: "Maria Garcia",
        latestMessage: {
            msg: "Just pushed the updated design files",
            seen: false,
            time: "09:45 AM"
        },
        isSeen: false 
    },
    {
        name: "James Wilson",
        latestMessage: {
            msg: "Server deployment completed successfully",
            seen: true,
            time: "Yesterday"
        },
        isSeen: true  
    },
    {
        name: "Sarah Chen",
        latestMessage: {
            msg: "Found some issues in the latest build",
            seen: true,
            time: "Yesterday"
        },
        isSeen: true  
    }
];

const MockSupervisors = [
    {
        name: "Dr. Roberts",
        latestMessage: {
            msg: "Let's discuss the project architecture tomorrow",
            seen: false,
            time: "2:15 PM"
        },
        isSeen: false
    },
    {
        name: "Prof. Anderson",
        latestMessage: {
            msg: "Good work on the latest features",
            seen: true,
            time: "Yesterday"
        },
        isSeen: true
    }
]

const mock = [...MockTeamMembers, ...MockSupervisors];

const ContactList:React.FC = () => {
      const isDarkMode = useSelector((state: RootState) => state.booleans.isDarkMode);
        useEffect(() => {
            if(isDarkMode){
                ChangeThemeColor("#0a0a0a");
            }
        },[]);
    return (
            <div className=' max-sm:w-full w-[25%] min-w-[250px] h-[calc(100vh-60px)] border-r'>
            <div className=" px-5 py-2 mt-3  relative max-sm:p-3 max-sm:px-5">
                <Search size={16} className=' absolute max-sm:top-5.5 max-sm:left-7.5
                 top-4.5 text-muted-foreground left-8'/>
                <Input
                    className=' pl-8 '
                    placeholder='Search'
                />
            </div>
            <hr className=' mx-5 my-2'/>
            {/* <Separator className=' my-2'/> */}
            <div className=' w-full overflow-y-auto max-h-[calc(100vh-75px)] mybar max-sm:p-5 p-3'>
                {
                    mock.map((member, index) => (
                        <Link href={`${index + 1}`} className=' no-underline' key={index}>
                            <Card key={index} className=' !py-2.5 relative !border-0 mb-3'>
                                <CardContent className=' flex gap-3 items-center'>
                                    <Avatar>
                                        <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 1}`} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className=' flex flex-col'>
                                        <span className=' text-sm'>{member.name}</span>
                                        {
                                            member.latestMessage.msg.trim().length > 0 &&
                                            <span className=' text-muted-foreground text-xs line-clamp-1 mr-10'>{member.latestMessage.msg}</span>
                                        }
                                        {
                                            !member.isSeen &&
                                            <span className=' absolute bg-green-500 rounded-full top-2 right-2  w-4 h-4'>
                                            </span>
                                        }
                                        <span className=' absolute right-2 text-muted-foreground text-xs bottom-2'>
                                            {member.latestMessage.time}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                }
            </div>
        </div>
  )
}

export default ContactList