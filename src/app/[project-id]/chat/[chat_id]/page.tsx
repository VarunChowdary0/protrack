import IndividualChat from '@/components/chat/widgets/IndividualChat'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <>
         <div className=' flex-1'>
            <Suspense fallback={<div className='flex items-center justify-center h-screen'>
                <Loader className=' animate-spin text-primary'/>
            </div>}>
                <IndividualChat/>
            </Suspense>
      </div>
    </>
  )
}

export default page