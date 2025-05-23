"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { checkAuthentication, redirectToSpotifyAuthorize, logout, getCurrentUser } from "@/lib/auth-utils"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

// Set to 1 hour in milliseconds
const SESSION_REFRESH_INTERVAL = 60 * 60 * 1000 // 1 hour

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const checkAuth = async () => {
    try {
      const isAuthed = await checkAuthentication()
      setIsAuthenticated(isAuthed)

      if (isAuthed) {
        const userData = await getCurrentUser()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error checking authentication:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial auth check
    checkAuth()

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up interval to periodically check authentication
    intervalRef.current = setInterval(() => {
      console.log("Refreshing auth session...")
      checkAuth()
    }, SESSION_REFRESH_INTERVAL)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const handleLogin = () => {
    redirectToSpotifyAuthorize()
  }

  const handleLogout = async () => {
    await logout()
    setIsAuthenticated(false)
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
