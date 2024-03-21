"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// UserProvider component manages user authentication state

// Define the shape of the user object
const UserContext = createContext({
  user: {
    username: "",
    id: ""
  },
  login: (userData) => {},
  logout: () => {}
});
// Custom hook to access the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  // This is needed to prevent problems with SSR
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [user, setUser] = useState(() => {
    try {
      // Check if localStorage is available in the browser environment
      if (isClient) {
        const storedUser = localStorage.getItem('tsion-user');
        return storedUser ? JSON.parse(storedUser) : { username: "", id: "" }
      } else {
        return { username: "", id: "" }
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return { username: "", id: "" }
    } finally {
      setLoading(false);
    }
  })
  
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    // Check if localStorage is available in the browser environment
    if (isClient) {
      localStorage.setItem('tsion-user', JSON.stringify(user));
    }
  }, [user, isClient]);

  // Redirect when not logged in
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        if (!user.username) {
          router.replace('/dashboard/login');
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [loading, user.username]);

  // Function to log in a user
  // ! FIX THIS
  const login = (userData) => {
    console.log(userData)
    setUser(userData);
  };

  // Function to log out a user
  const logout = () => {
    setUser({
      username: "",
      id: ""
    });
    router.push('/dashboard/login');
  };

  // Provide the user context to children components
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};