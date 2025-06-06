import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProviderAll from "@/components/ProviderAll";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Protrack",
  keywords: [
    "project management",
    "task tracking",
    "team collaboration",
    "college project management",
    "event scheduling",
    "real-time chat",
    "notifications",
    "supervisor involvement",
    "full-stack platform",
    "centralized system"
  ],
  authors: [
    {
      name: "Sai Varun Chowdary Poluase",
      url: "https://saivarun.vercel.app",
    },
  ],
  description: "Protrack is a full-stack project management platform tailored for colleges and organizations. It enables efficient tracking of project phases, team collaboration, supervisor involvement, real-time chat, notifications, and event scheduling — all in one centralized system.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">  {/* <--- allow 'dark' class here */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProviderAll>
          {children}
        </ProviderAll>
      </body>
    </html>
  );
}
