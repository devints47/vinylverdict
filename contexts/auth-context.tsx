"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { checkAuthentication, redirectToSpotifyAuthorize, logout, getCurrentUser } from "@/lib/auth-utils"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  error: string | null // Add error property
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null, // Add default error value
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
  const [error, setError] = useState<string | null>(null) // Add error state
  const router = useRouter()

  const checkAuth = async () => {
    try {
      console.log("🔍 Checking authentication...")
      const isAuthed = await checkAuthentication()
      console.log("✅ Authentication result:", isAuthed)
      setIsAuthenticated(isAuthed)

      if (isAuthed) {
        console.log("👤 Fetching user data...")
        const userData = await getCurrentUser()
        console.log("✅ User data:", userData ? "loaded" : "failed")
        setUser(userData)
      } else {
        setUser(null)
      }
      setError(null) // Clear any previous errors
    } catch (error) {
      console.error("❌ Error checking authentication:", error)
      setIsAuthenticated(false)
      setUser(null)
      setError(error instanceof Error ? error.message : "Authentication failed")
    } finally {
      console.log("🏁 Auth check complete, setting loading to false")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("🚀 AuthProvider mounted, starting auth check...")
    checkAuth()

    // Set up interval to periodically check authentication
    const interval = setInterval(() => {
      console.log("⏰ Periodic auth check...")
      checkAuth()
    }, SESSION_REFRESH_INTERVAL)

    return () => {
      console.log("🧹 Cleaning up auth interval")
      clearInterval(interval)
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
        error, // Add error to context
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
