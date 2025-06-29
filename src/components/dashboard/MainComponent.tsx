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
import { Loader2 } from 'lucide-react'
import { OwnerCard } from './widgets/OwnerCard'


const MainComponent = () => {
  const isDarkMode = useSelector((state:RootState)=> state.booleans.isDarkMode);
  const project = useSelector((state:RootState)=> state.selectedProject);
  useEffect(()=>{
    if(isDarkMode){
      ChangeThemeColor("#171717");
    }
  },[isDarkMode]);
  const auth = useSelector((state:RootState)=> state.auth);
  if(!project.isLoaded){
    return (
      <div className='flex h-screen items-center justify-center'>
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }
  return (
    <div className=' relative flex h-full max-sm:pb-32 dark:max-sm:bg-primary-foreground gap-10 flex-col snap-mandatory snap-y items-center py-20 max-sm:py-5'>
      {
        auth.user?.id === project.project?.creator_id &&
          <OwnerCard/>
      }
      <DescriptionCard />
      <Members/>
      <ProjectTimeLine/>
      <UpCommingActivities/>
      <Resources/>
    </div>
  )
}

export default MainComponent