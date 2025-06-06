"use client";


import store from '@/redux/store';
import React from 'react'
import { Provider } from "react-redux";
import ToggleTheame from './ui/ToggleTheame';


const ProviderAll = ({ children }: { children: React.ReactNode }) => {
  return (
      <Provider store={store}>
        <ToggleTheame />
        {children}
      </Provider>
  )
}

export default ProviderAll