"use client";

import NotFound from "@/components/NotFound";
import { RootState } from "@/redux/store";
import { UserRole } from "@/types/userTypes";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const auth = useSelector((state: RootState) => state.auth);
    
    if(!auth.user?.id){
        return <div className=" w-screen h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20 text-muted-foreground" />
        </div>
    }
    if(auth.user?.role !== UserRole.ADMIN) {
        return <NotFound/>
    }
  return (
      <div className="flex-1 overflow-y-auto">{children}</div>
  )
}