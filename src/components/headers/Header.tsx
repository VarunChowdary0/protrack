"use client";

import { RootState } from '@/redux/store';
import { Boxes, Calendar, Home, ListTodoIcon, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Logo0 from './Logo0';
import { useParams } from 'next/navigation';
const items = [

  {
    title: "Home",
    url: "dashboard",
    icon: Home
  },
  {
    title: "Todos",
    url: "todos",
    icon: ListTodoIcon
  },
  {
    title: "Calendar",
    url: "calendar",
    icon: Calendar
  },
  {
    title: "Chat",
    url: "chat",
    icon: MessageCircle
  },    {
    title: "Projects",
    url: "/u",
    icon: Boxes
  }
]


const Header:React.FC = () => {
  const {project_id} = useParams();
  const hideBottomBar = useSelector((state:RootState) => state.booleans.isChatOpen);
  useEffect(()=>{
    console.log("hideBottomBar", hideBottomBar);
  },[hideBottomBar])
  return (
    <>
        <div className=' bg-card   max-sm:hidden px-4 w-full py-3 flex justify-around mr-[60px] border-b'>
            <Logo0/>
            <div className=' flex gap-4'>
                {
                    items.map((item) => (
                        <Link 
                            key={item.title} 
                            href={item.url.startsWith('/')&&project_id ? item.url : `/${project_id}/${item.url}`} 
                            className=' text-md text-muted-foreground hover:text-foreground transition-colors'
                        >
                            {item.title}
                        </Link>
                    ))
                }
            </div>
        </div>
        <div style={{zIndex:hideBottomBar?-1:2000}} className=' hidden max-sm:flex fixed bottom-0 left-0 right-0
         p-2 border-t dark:bg-black bg-white'>
            {
                items.map((item) => (
                    <Link 
                        key={item.title} 
                        href={item.url.startsWith('/')&&project_id ? item.url : `/${project_id}/${item.url}`} 
                        className=' flex flex-col items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors w-full'
                    >
                        <item.icon size={20} className=' mb-1' />
                        <span className=' text-xs'>{item.title}</span>
                    </Link>
                ))
            }
        </div>
    </>
  )
}

export default Header