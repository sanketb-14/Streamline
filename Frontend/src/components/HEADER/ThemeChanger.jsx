import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

/**
 * ThemeSwitcher component that toggles between light (corporate) and dark (business) themes
 * Persists user preference in localStorage and applies the theme to the document
 * 
 * @returns {JSX.Element} Theme toggle button with appropriate icon and tooltip
 */
const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('corporate');
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize theme from localStorage or default to 'corporate'
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'corporate';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setIsMounted(true);
  }, []);

  /**
   * Toggles between corporate (light) and business (dark) themes
   * Updates state, localStorage, and document attribute
   */
  const toggleTheme = () => {
    const newTheme = theme === 'corporate' ? 'business' : 'corporate';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <button className="btn btn-circle btn-ghost opacity-0">
        <Monitor className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative group">
      <button 
        onClick={toggleTheme}
        className="btn btn-circle btn-ghost hover:bg-base-200/70 transition-colors duration-200"
        aria-label={`Toggle theme - current theme is ${theme}`}
      >
        {theme === 'corporate' ? (
          <Sun className="w-5 h-5 text-base-content/90" />
        ) : (
          <Moon className="w-5 h-5 text-base-content/90" />
        )}
      </button>
      
      {/* Animated tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium bg-base-300 text-base-content rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Switch to {theme === 'corporate' ? 'dark' : 'light'} theme
      </div>
    </div>
  );
};

export default ThemeSwitcher;