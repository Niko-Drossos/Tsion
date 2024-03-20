"use client"
import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Read theme mode from local storage or default to 'light'
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    // Update local storage whenever theme mode changes
    localStorage.setItem('themeMode', mode);

    document.documentElement.setAttribute('color-scheme', mode);
  }, [mode]);

  const toggle = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
