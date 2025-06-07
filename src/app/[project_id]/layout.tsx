"use client";
  import Header from "@/components/headers/Header";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Header/>
      </Suspense>
      <main>
        {children}
      </main>
    </>
  )
}