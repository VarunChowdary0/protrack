"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthData, clearAuthData } from '@/redux/reducers/AuthReducer';
import { redirect, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlertIcon } from 'lucide-react';

const SessionSync = () => {
  const session = useSession();
  const path = usePathname();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(5);
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    console.log("Session Sync: Current session status:", session);
    if (session.status === "authenticated" && session.data?.user) {
      dispatch(setAuthData(session.data.user));
      console.log("Session Sync: User data set in Redux", session.data.user);
    } else if (session.status === "unauthenticated") {
      dispatch(clearAuthData());
        console.log("Session Sync: User data cleared from Redux");
    }
    if(session.data?.user?.id?.length === 0){
      console.log("Session Sync: New user detected, redirecting to onboarding");
      if(!path.endsWith("/onboarding")){
        setNewUser(true);
        toast.warning(`Redirecting in ${countdown} seconds...`, {
          description: "Please complete your profile to get started.",
          icon: <TriangleAlertIcon className="text-amber-500 h-5 w-5" />,
          duration: 5000,
          position: "top-right",
          className: "bg-card border border-border",
          action: {
            label: "Go to Onboarding",
            onClick: () => {
              redirect("/onboarding");
            },
          }
        });
        
        setTimeout(() => {
          redirect("/onboarding");
        }, 5000);

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
        // redirect("/onboarding");
      }
    }
    
  }, [session]);
  if(newUser && !path.endsWith("/onboarding")){
    return <div className=' w-full h-10 bg-card'></div>;
  }
  return null;
};

export default SessionSync;
