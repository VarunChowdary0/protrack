"use client"
import React, { useEffect } from 'react'
import DescriptionCard from './widgets/DescriptionCard'
import ProjectTimeLine from './widgets/ProjectTimeLine'
import Members from './widgets/Members'
import UpCommingActivities from './widgets/UpCommingActivities'
import Resources from './widgets/Resources'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ChangeThemeColor from '@/lib/ChangeThemeColor'


const MainComponent = () => {
  const isDarkMode = useSelector((state:RootState)=> state.booleans.isDarkMode)
  useEffect(()=>{
    if(isDarkMode){
      ChangeThemeColor("#171717");
    }
  },[isDarkMode])
  return (
    <div className=' flex h-full max-sm:pb-32 dark:max-sm:bg-primary-foreground gap-10 flex-col snap-mandatory snap-y items-center py-20 max-sm:py-5'>
      <DescriptionCard />
      <Members/>
      <ProjectTimeLine/>
      <UpCommingActivities/>
      <Resources/>
    </div>
  )
}

export default MainComponent