import RegisterOrganization from '@/components/Organization/RegisterOrganization'
import React from 'react'

// only admin
const page = () => {
  return (
    <>
      <div className=' w-screen h-screen  flex items-center justify-center'>
        <RegisterOrganization/>
      </div>
    </>
  )
}

export default page