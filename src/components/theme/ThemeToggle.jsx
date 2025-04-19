import React, { useEffect, useState } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // Apply theme to both documentElement and body
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    // Add transition for smooth color changes, but only after initial load
    const timeout = setTimeout(() => {
      document.documentElement.style.transition = 'all 0.3s ease-in-out';
      document.body.style.transition = 'all 0.3s ease-in-out';
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <div className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      {theme === 'light' ? <BsMoon /> : <BsSun />}
    </div>
  );
};

export default ThemeToggle; 