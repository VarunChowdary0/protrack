"use client";

import { Loader } from 'lucide-react';
import { redirect, useParams } from 'next/navigation';
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
      <Redirector/>
    </Suspense>
  )
}

export default page

const Redirector:React.FC = () => {
    const {project_id} = useParams();
    redirect(`/${project_id}/todos/all`);
    return (
      <div className=' h-screen w-full flex items-center justify-center'>
        <Loader className='h-10 w-10 animate-spin text-secondary' />
      </div>
    );   
}