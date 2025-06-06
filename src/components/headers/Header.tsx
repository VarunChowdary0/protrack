"use client";

import { RootState } from '@/redux/store';
import { Calendar, Home, ListTodoIcon, MessageCircle, User2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
const items = [
  {
    title: "Home",
    url: "dashboard",
    icon: Home
  },
  {
    title: "Tods",
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
  },
  {
    title: "Profile",
    url: "profile",
    icon: User2
  },
]
const Logo = () => {
    return (
        <div className=' font-semibold px-2 text-lg bg-black rounded-md tracking-widest'>
            <span className=' text-rose-400'>Pro</span>
            <span className=' text-white'>track</span>
        </div>
    );
}
const Header:React.FC = () => {
  const hideBottomBar = useSelector((state:RootState) => state.booleans.isChatOpen);
  useEffect(()=>{
    console.log("hideBottomBar", hideBottomBar);
  },[hideBottomBar])
  return (
    <>
        <div className=' max-sm:hidden px-4 w-full py-3 flex justify-around mr-[60px] border-b'>
            <Logo/>
            <div className=' flex gap-4'>
                {
                    items.map((item) => (
                        <Link 
                            key={item.title} 
                            href={item.url} 
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
                        href={item.url} 
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