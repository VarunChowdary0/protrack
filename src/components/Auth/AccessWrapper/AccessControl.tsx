"use client"

import { LoaderCircle } from 'lucide-react';
import { useSession, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthData, clearAuthData } from '@/redux/reducers/AuthReducer';
import { redirect, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlertIcon } from 'lucide-react';

const AccessControl = ({children}: {children: React.ReactNode}) => {
  const session = useSession();
  const path = usePathname();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if(!session || session.status === "unauthenticated"){
        if(!path.endsWith("/login")){
          redirect("/login");
        }
    }
    const handleSession = async () => {
      console.log("Session Sync: Current session status:", session);

      // Attempt a session refresh if access is missing
      if (
        session.status === "authenticated" &&
        session.data?.user &&
        !("access" in session.data.user)       
      ) {
        console.log("Session Sync: 'access' missing. Refreshing session...");
        const freshSession = await getSession();
        if (freshSession?.user) {
          dispatch(setAuthData(freshSession.user));
          console.log("Session Sync: Fresh session fetched", freshSession.user);
        }
      } else if (session.status === "authenticated" && session.data?.user) {
        dispatch(setAuthData(session.data.user));
        console.log("Session Sync: User data set in Redux", session.data.user);
      } else if (session.status === "unauthenticated") {
        dispatch(clearAuthData());
        console.log("Session Sync: User data cleared from Redux");
      }

      if (session.data?.user?.id?.length === 0 && !path.endsWith("/onboarding")) {
        console.log("Session Sync: New user detected, redirecting to onboarding");
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
          },
        });

        setTimeout(() => {
          redirect("/onboarding");
        }, 5000);

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) clearInterval(timer);
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      }
    };

    handleSession();
  }, [session, path]);

    if(session.status === "loading"){
        return (
            <div className=' w-screen h-screen flex items-center justify-center'>
                <LoaderCircle className='animate-spin text-primary' />
            </div>
        );
    }
  return (
    <>
        {children}
    </>
  )
}

export default AccessControl