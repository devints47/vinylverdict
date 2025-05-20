"use client"

import { useAuth } from "@/contexts/auth-context"
import { SpotifyLoginButton } from "./spotify-login-button"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function AuthButtonWrapper() {
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Only show auth buttons after hydration to prevent layout shift
  useEffect(() => {
    setMounted(true)
  }, [])

  // Before hydration, render a placeholder with the same dimensions
  if (!mounted) {
    return (
      <div className="flex items-center h-10">
        <div className="w-[120px] h-10 rounded-full bg-zinc-800/50"></div>
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
          className="relative overflow-hidden btn-gradient holographic-shimmer text-white font-bold py-2 px-6 text-base rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    )
  }

  return <SpotifyLoginButton text="Log in" className="py-2 px-6 text-base" />
}
