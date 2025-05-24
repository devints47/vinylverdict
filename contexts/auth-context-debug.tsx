"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  error: string | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log("🎯 DEBUG: AuthProvider useEffect triggered!")

    // Temporary: Just set loading to false after 2 seconds to test
    const timeoutId = setTimeout(() => {
      console.log("🎯 DEBUG: Setting loading to false")
      setIsLoading(false)
      setIsAuthenticated(false)
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const handleLogin = () => {
    console.log("🎯 DEBUG: Login clicked")
    // Temporarily just log instead of redirecting
  }

  const handleLogout = async () => {
    console.log("🎯 DEBUG: Logout clicked")
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        error,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
