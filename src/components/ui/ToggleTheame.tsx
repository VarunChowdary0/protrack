'use client';

import ChangeThemeColor from '@/lib/ChangeThemeColor';
import { setDarkMode } from '@/redux/reducers/BooleanReducer';
import { RootState } from '@/redux/store';
import { MoonIcon, SunIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ToggleTheme: React.FC = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state:RootState)=> state.booleans.isDarkMode);
  // Initialize theme on mount
  useEffect(() => {
    const prefersDark = localStorage.getItem('theme') === 'dark';
    dispatch(setDarkMode(prefersDark));
    document.documentElement.classList.toggle('dark', prefersDark); // <-- set on <html>
  }, []);

  // Update theme and meta tag on change
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
    ChangeThemeColor(isDarkMode ? '#0a0a0a' : '#ffffff');
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log("Toggle theme clicked");
    dispatch(setDarkMode(!isDarkMode));
  };

  return (
    <div onClick={toggleTheme} className='fixed right-3 top-3 z-50'>
      {isDarkMode ? (
        <SunIcon className='h-6 w-6 text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors duration-200' />
      ) : (
        <MoonIcon className='h-6 w-6 text-gray-800 cursor-pointer hover:text-gray-900 transition-colors duration-200' />
      )}
    </div>
  );
};

export default ToggleTheme;
