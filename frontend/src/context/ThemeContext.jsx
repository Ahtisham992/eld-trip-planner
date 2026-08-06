import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get from individual theme storage or fall back to old appSettings
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) return savedTheme;
    
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.theme) return parsed.theme;
      } catch (e) {}
    }
    return 'system';
  });

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    
    // Also update appSettings if it exists so Settings.jsx stays in sync
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        parsed.theme = theme;
        localStorage.setItem('appSettings', JSON.stringify(parsed));
      } catch (e) {}
    }

    const root = document.documentElement;
    const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
      } else {
        // System preference
        if (systemMedia.matches) {
          root.setAttribute('data-theme', 'dark');
        } else {
          root.setAttribute('data-theme', 'light');
        }
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === 'system') applyTheme();
    };
    
    systemMedia.addEventListener('change', listener);
    return () => systemMedia.removeEventListener('change', listener);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
