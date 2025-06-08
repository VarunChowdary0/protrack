"use client";

import store from '@/redux/store';
import React from 'react';
import { Provider as ReduxProvider } from "react-redux";
import ToggleTheme from './ui/ToggleTheame';
import { TooltipProvider } from './ui/tooltip';
import { Toaster } from "@/components/ui/sonner";
import SessionSync from './Auth/SessionSync';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';

const ProviderAll = ({ 
  children,
  session
}: { 
  children: React.ReactNode;
  session?: SessionProviderProps['session'];
}) => {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <TooltipProvider>
          <ToggleTheme />
          <Toaster />
          <SessionSync />
          {children}
        </TooltipProvider>
      </ReduxProvider>
    </SessionProvider>
  );
};

export default ProviderAll;