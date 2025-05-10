"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCallback } from "react"

interface SpotifyLoginButtonProps {
  className?: string
  text?: string
  showHoverEffect?: boolean
}

export function SpotifyLoginButton({ className, text = "Log in", showHoverEffect = false }: SpotifyLoginButtonProps) {
  const { login, isLoading } = useAuth()
  const [isHovered, setIsHovered] = useState(false)

  const handleLogin = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      console.log("Login button clicked")
      login()
    },
    [login],
  )

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden btn-gradient holographic-shimmer text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ${showHoverEffect ? "hover:scale-110 hover:shadow-purple-glow" : "hover:scale-105"} flex items-center gap-2 shadow-lg ${className || ""}`}
    >
      {/* Pulsing background effect - only shown when showHoverEffect is true */}
      {showHoverEffect && (
        <div
          className={`absolute inset-0 bg-purple-600/30 rounded-full pulse-animation ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        ></div>
      )}

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-2 w-full">
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <span className={`transition-all duration-300 ${showHoverEffect && isHovered ? "scale-110" : "scale-100"}`}>
              {text}
            </span>
            {showHoverEffect && isHovered && <span className="ml-1 animate-pulse">→</span>}
          </>
        )}
      </div>
    </Button>
  )
}
