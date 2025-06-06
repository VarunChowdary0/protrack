"use client";

import InitialHeader from "@/components/headers/InitialHeader";

export default function ULayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InitialHeader/>
      <main>
        {children}
      </main>
    </>
  )
}