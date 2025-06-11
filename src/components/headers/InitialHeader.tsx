"use client";

import { RootState } from '@/redux/store';
import { Boxes, Calendar, EarthIcon, Inbox, User2Icon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Logo0 from './Logo0';
import { UserRole } from '@/types/userTypes';

const items = [
  {
    title: "Projects",
    url: "/u",
    icon: Boxes
  },
  {
    title: "Inbox",
    url: "/u/inbox",
    icon: Inbox
  },
  {
    title: "Calendar",
    url: "/u/calendar",
    icon: Calendar
  },{
    title: "Profile",
    url: "/u/profile",
    icon: User2Icon
  }
]

const InitialHeader:React.FC = () => {
  const hideBottomBar = useSelector((state:RootState) => state.booleans.isChatOpen);
  const auth = useSelector((state:RootState) => state.auth);
  useEffect(()=>{
    console.log("hideBottomBar", hideBottomBar);
  },[hideBottomBar])
  return (
    <>
        <div className=' max-sm:hidden bg-card px-4 w-full py-3 flex justify-around mr-[60px] border-b'>
            <Logo0/>
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
                {
                    auth?.user?.role === UserRole.ADMIN && 
                        <Link 
                            key={"adm"} 
                            href={"/admin"} 
                            className=' text-md text-muted-foreground hover:text-foreground transition-colors'
                        >
                            Admin
                        </Link>
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
             {
                auth?.user?.role === UserRole.ADMIN && 
                  <Link 
                        key={"adm"} 
                        href={"/admin"} 
                        className=' flex flex-col items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors w-full'
                    >
                      <EarthIcon size={20} className=' mb-1' />
                      <span className=' text-xs'>Admin</span>
                  </Link>
                }
        </div>
    </>
  )
}

export default InitialHeader