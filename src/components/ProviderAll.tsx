"use client";


import store from '@/redux/store';
import React from 'react'
import { Provider } from "react-redux";
import ToggleTheame from './ui/ToggleTheame';
import { TooltipProvider } from './ui/tooltip';
import { Toaster } from "@/components/ui/sonner"


const ProviderAll = ({ children }: { children: React.ReactNode }) => {
  return (
      <Provider store={store}>
        <TooltipProvider>
          <ToggleTheame />
          <Toaster />
          {children}
        </TooltipProvider>
      </Provider>
  )
}

export default ProviderAll