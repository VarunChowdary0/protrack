"use client";

import InitialHeader from "@/components/headers/InitialHeader";
import NotificationRequest from "@/components/noti/notification";

export default function ULayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InitialHeader/>
      <NotificationRequest showControls={false}/>
      <main>
        {children}
      </main>
    </>
  )
}