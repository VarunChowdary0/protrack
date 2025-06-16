"use client"

import React, { Suspense} from 'react'
import { Loader2 } from 'lucide-react'
import InboxMapper from './widgets/InBoxMapper'

const MainInboxComp = () => {

  return (
    <div className=' flex h-full max-sm:p-0 w-full max-sm:py-0 max-sm:mt-0 gap-10 flex-col
     snap-mandatory snap-y  pb-5 '>
      <Suspense fallback={
        <Loader2 className='w-10 h-10 animate-spin text-primary mx-auto mt-20' />
      }>
        <InboxMapper/>
      </Suspense>
    </div>
  )
}

export default MainInboxComp