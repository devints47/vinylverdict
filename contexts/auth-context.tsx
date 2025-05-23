"use client"

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react"
import { checkAuthentication, getCurrentUser, logout as logoutUtil, redirectToSpotifyAuthorize } from "@/lib/auth-utils"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  user: any | null
  login: () => void
  logout: () => void
  getValidAccessToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Changed from 5 minutes to 1 hour
const SESSION_REFRESH_INTERVAL = 60 * 60 * 1000 // 1 hour in milliseconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    error: null as string | null,
  })

  // Get a valid access token (will refresh if needed)
  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      // Call the server endpoint to get a valid token
      const response = await fetch("/api/auth/token")

      if (!response.ok) {
        console.error("Failed to get valid access token:", response.status)
        return null
      }

      const data = await response.json()
      return data.accessToken || null
    } catch (error) {
      console.error("Error getting valid access token:", error)
      return null
    }
  }, [])

  // Check authentication status on mount and set up periodic checks
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only run on client-side
        if (typeof window === "undefined") {
          setIsLoading(false)
          return
        }

        console.log("Checking authentication status...")
        const authenticated = await checkAuthentication()
        console.log("Auth check result:", authenticated)

        if (authenticated) {
          // Get user profile
          const userProfile = await getCurrentUser()
          setUser(userProfile)
        }

        setAuthState({
          isAuthenticated: authenticated,
          error: null,
        })
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthState({
          isAuthenticated: false,
          error: "Failed to check authentication status",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Initial auth check
    checkAuth()

    // Set up periodic authentication checks every hour instead of every 5 minutes
    const intervalId = setInterval(checkAuth, SESSION_REFRESH_INTERVAL)

    return () => clearInterval(intervalId)
  }, [])

  // Handle login
  const login = async () => {
    try {
      console.log("Login initiated")
      setIsLoading(true)
      setAuthState((prev) => ({ ...prev, error: null }))

      // Redirect to Spotify authorization
      await redirectToSpotifyAuthorize()

      // This code won't execute because the page will redirect
    } catch (error) {
      console.error("Login error:", error)
      setAuthState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to initiate login",
      }))
      setIsLoading(false)
    }
  }

  // Handle logout
  const logout = async () => {
    try {
      await logoutUtil()
      setUser(null)
      setAuthState({
        isAuthenticated: false,
        error: null,
      })

      // Force reload to clear any cached state
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    error: authState.error,
    user,
    login,
    logout,
    getValidAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
