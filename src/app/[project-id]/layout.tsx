"use client";
  import Header from "@/components/headers/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header/>
      <main>
        {children}
      </main>
    </>
  )
}