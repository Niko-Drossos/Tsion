"use client"
import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false)

  // This is needed to prevent problems with SSR
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [mode, setMode] = useState(() => {
    // Read theme mode from local storage or default to 'light'
    if (isClient) {
      return localStorage.getItem('themeMode') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Update local storage whenever theme mode changes
    if (isClient) localStorage.setItem('themeMode', mode)

    document.documentElement.setAttribute('color-scheme', mode || 'light');
  }, [mode, isClient]);

  const toggle = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
