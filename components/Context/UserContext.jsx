"use client"
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

// UserProvider component manages user authentication state

// Define the shape of the user object
const UserContext = createContext({
  user: {
    username: "",
    email: "",
    id: "",
  },
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false)
  // const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState({
    username: "",
    email: "",
    id: "",
  });
  
  // This is needed to prevent problems with SSR
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      try {
        const storedUser = localStorage.getItem('tsion-user');
        console.log("storedUser: ", storedUser)
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          // Redirect to login page if no user data found in localStorage
          router.replace('/dashboard/login');
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [isClient, router]);

  const login = useCallback((userData) => {
    setUser(userData);
    if (isClient) {
      localStorage.setItem('tsion-user', JSON.stringify(userData));
    }
  }, [isClient]);

  const logout = () => {
    setUser(null);
    if (isClient) {
      localStorage.removeItem('tsion-user');
      deleteCookie('tsion');
      router.replace('/dashboard/login');
    }
  };

  // Provide the user context to children components
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 