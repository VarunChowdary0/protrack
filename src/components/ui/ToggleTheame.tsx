'use client';

import ChangeThemeColor from '@/lib/ChangeThemeColor';
import { setDarkMode } from '@/redux/reducers/BooleanReducer';
import { RootState } from '@/redux/store';
import { Label } from '@radix-ui/react-label';
import { Moon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '../ui/switch'

interface cup {
  controls?: boolean;
}
const ToggleTheme:React.FC<cup> = ({controls = false}) => {
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
  if(!controls) return null; // If controls prop is false, do not render the component

  return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
        <Switch 
          id="dark-mode" 
          checked={isDarkMode}
          onCheckedChange={() => toggleTheme()}
        />
      </div>
     
  );
};

export default ToggleTheme;
