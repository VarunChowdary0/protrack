import Logo0 from '@/components/headers/Logo0'
import RegisterOrganization from '@/components/Organization/RegisterOrganization'
import React from 'react'

// only admin
const page = () => {
  return (
    <>
    <div className=' fixed top-4 left-4'>
      <Logo0/>
    </div>
      <div className=' w-screen h-screen  flex items-center justify-center'>
        <RegisterOrganization/>
      </div>
    </>
  )
}

export default page