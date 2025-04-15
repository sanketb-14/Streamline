import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('corporate');
  
  // Initialize theme from localStorage or default to 'corporate'
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'corporate';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'corporate' ? 'night' : 'corporate';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleTheme}
        className="btn btn-circle btn-ghost hover:bg-base-300"
        aria-label="Toggle theme"
      >
        {theme === 'corporate' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
      <div className="tooltip tooltip-bottom absolute -top-10" data-tip={`Switch to ${theme === 'corporate' ? 'night' : 'corporate'} theme`}>
      </div>
    </div>
  );
};

export default ThemeSwitcher;