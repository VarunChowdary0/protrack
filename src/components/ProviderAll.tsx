"use client";

import store from '@/redux/store';
import React from 'react';
import { Provider as ReduxProvider } from "react-redux";
import { TooltipProvider } from './ui/tooltip';
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import AccessControl from './Auth/AccessWrapper/AccessControl';
import ToggleTheme from './ui/ToggleTheame';

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
          <Toaster />
          <AccessControl>
          <ToggleTheme/>
            {children}
          </AccessControl>
        </TooltipProvider>
      </ReduxProvider>
    </SessionProvider>
  );
};

export default ProviderAll;