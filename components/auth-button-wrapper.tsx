"use client"

import { useAuth } from "@/contexts/auth-context"
import { SpotifyLoginButton } from "./spotify-login-button"
import { LogOut, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface AuthButtonWrapperProps {
  forceLogout?: boolean // New prop to force showing logout button
}

export function AuthButtonWrapper({ forceLogout = false }: AuthButtonWrapperProps) {
  const { isAuthenticated, logout, isLoading } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Only show auth buttons after hydration to prevent layout shift
  useEffect(() => {
    setMounted(true)
  }, [])

  // If forceLogout is true (dashboard), always show logout button immediately
  if (forceLogout) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={logout}
          className="relative overflow-hidden btn-gradient holographic-shimmer text-white font-bold py-2 px-6 text-base rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg min-w-[120px] justify-center"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    )
  }

  // Before hydration, render a placeholder with the same dimensions (only for non-dashboard pages)
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center gap-4">
        <button
          disabled
          style={{width: '132px'}}
          className="relative overflow-hidden btn-gradient holographic-shimmer text-white font-bold py-2 px-6 text-base rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg min-w-[120px] justify-center"
        >
          <Loader2 size={18} className="animate-spin" />
          <span>Loading</span>
        </button>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        {!pathname.startsWith("/dashboard") && (
          <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            <User size={18} />
            <span>Dashboard</span>
          </Link>
        )}
        <button
          onClick={logout}
          style={{width: '132px'}}
          className="relative overflow-hidden btn-gradient holographic-shimmer text-white font-bold py-2 px-6 text-base rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg min-w-[120px] justify-center"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    )
  }

  return <SpotifyLoginButton text="Log in" className="py-2 px-6 text-base min-w-[120px]" />
}
