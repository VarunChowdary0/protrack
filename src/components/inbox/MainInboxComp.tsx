"use client"

import React, { useEffect } from 'react'
import ContentsMapper from './widgets/ContentsMapper'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ChangeThemeColor from '@/lib/ChangeThemeColor'

const MainInboxComp = () => {
  const isDarkMode = useSelector((state:RootState)=> state.booleans.isDarkMode)
  useEffect(()=>{
    if(isDarkMode){
      ChangeThemeColor("#171717");
    }
  },[isDarkMode])
  return (
    <div className=' flex h-full max-sm:p-0 w-full max-sm:py-0 max-sm:mt-0 gap-10 flex-col
     snap-mandatory snap-y items-center py-5 '>
        <ContentsMapper/>
    </div>
  )
}

export default MainInboxComp