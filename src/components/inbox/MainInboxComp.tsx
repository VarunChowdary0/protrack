import React from 'react'
import ContentsMapper from './widgets/ContentsMapper'

const MainInboxComp = () => {
  return (
    <div className=' flex h-full max-sm:p-0 w-full max-sm:py-0 max-sm:mt-0 gap-10 flex-col snap-mandatory snap-y items-center py-10 '>
        <ContentsMapper/>
    </div>
  )
}

export default MainInboxComp