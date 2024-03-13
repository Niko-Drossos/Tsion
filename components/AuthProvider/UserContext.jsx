"use client"
import { createContext, useContext, useState, useEffect } from 'react';

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

// UserProvider component manages user authentication state
export const UserProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const [user, setUser] = useState(() => {
    try {
      // Check if localStorage is available in the browser environment
      if (isClient) {
        const storedUser = localStorage.getItem('tsion-user');
        return storedUser ? JSON.parse(storedUser) : { username: "", id: "" };
      } else {
        return { username: "", id: "" };
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return { username: "", id: "" };
    }
  });

  // Load user data from localStorage when component mounts
  useEffect(() => {
    // Check if localStorage is available in the browser environment
    if (isClient) {
      const storedUser = localStorage.getItem('tsion-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [isClient]);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    // Check if localStorage is available in the browser environment
    if (isClient) {
      localStorage.setItem('tsion-user', JSON.stringify(user));
    }
  }, [user, isClient]);

  // Function to log in a user
  const login = (userData) => {
    setUser(userData);
  };

  // Function to log out a user
  const logout = () => {
    setUser({
      username: "",
      id: ""
    });
  };

  // Provide the user context to children components
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
