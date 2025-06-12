import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProviderAll from "@/components/ProviderAll";
import { getServerSession } from "next-auth"


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
    themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1f1f" }
  ],
  description: "Protrack is a full-stack project management platform tailored for colleges and organizations. It enables efficient tracking of project phases, team collaboration, supervisor involvement, real-time chat, notifications, and event scheduling — all in one centralized system.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <meta name="theme-color" content="#ffffff"></meta>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProviderAll session={await getServerSession()}>
          {children}
        </ProviderAll>
      </body>
    </html>
  );
}
