'use client'

import { redirect } from "next/navigation"
import { useEffect } from "react"

 
export default function Page() {
  useEffect(() => {
    redirect("/u")
  })
  return (
    <div className=' flex flex-col items-center justify-center min-h-screen p-4'>
    </div>
  )
}