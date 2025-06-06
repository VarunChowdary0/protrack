import React from 'react'
import DescriptionCard from './widgets/DescriptionCard'
import ProjectTimeLine from './widgets/ProjectTimeLine'
import Members from './widgets/Members'
import UpCommingActivities from './widgets/UpCommingActivities'
import Resources from './widgets/Resources'


const MainComponent = () => {
  return (
    <div className=' flex h-full gap-10 flex-col snap-mandatory snap-y items-center py-10 max-sm:py-5'>
      <DescriptionCard />
      <Members/>
      <ProjectTimeLine/>
      <UpCommingActivities/>
      <Resources/>
    </div>
  )
}

export default MainComponent