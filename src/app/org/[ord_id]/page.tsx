import OrganizationPage from '@/components/Organization/OrganizationPage'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
      <OrganizationPage/>
    </Suspense>
  )
}

export default page