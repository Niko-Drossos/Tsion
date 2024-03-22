"use client"
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { deleteCookie, getCookie } from 'cookies-next'

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
})

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState({
    username: "",
    email: "",
    id: "",
  })

  // List of URL's that do not require user authentication
  const unauthorizedAccess = [
    "/dashboard/login",
    "/dashboard/register",
    "/"
  ]
  
  // This is needed to prevent problems with SSR
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      try {
        if (unauthorizedAccess.includes(pathname)) {
          // Let people access pages that don't need authentication
        } else if (localStorage.getItem('tsion-user') && getCookie("tsion")) {
          const parsedUser = JSON.parse(localStorage.getItem('tsion-user'))
          setUser(parsedUser)
        } else {
          // Redirect to login page if no user data found in localStorage
          router.replace('/dashboard/login')
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error)
      } finally {
        setLoading(false)
      }
    }
  }, [isClient, pathname])

  const login = useCallback((userData) => {
    setUser(userData)
    if (isClient) {
      localStorage.setItem('tsion-user', JSON.stringify(userData))
    }
  }, [isClient])

  const logout = () => {
    setUser(null)
    if (isClient) {
      localStorage.removeItem('tsion-user')
      deleteCookie('tsion')
      router.replace('/dashboard/login')
    }
  }

  // Provide the user context to children components
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to access the user context
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 