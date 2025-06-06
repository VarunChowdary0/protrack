'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ToggleTheme: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Set the initial theme based on localStorage
useEffect(() => {
    const prefersDark = localStorage.getItem('theme') === 'dark';
    setIsDarkMode(prefersDark);
    if (prefersDark) document.body.classList.add('dark');
}, []);

  // Apply the theme change
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

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
