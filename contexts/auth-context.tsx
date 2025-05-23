"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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

// Changed from 5 minutes to 1 hour
const SESSION_REFRESH_INTERVAL = 60 * 60 * 1000 // 1 hour in milliseconds

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

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
    checkAuth()

    // Set up interval to periodically check authentication
    const interval = setInterval(checkAuth, SESSION_REFRESH_INTERVAL)

    return () => clearInterval(interval)
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
