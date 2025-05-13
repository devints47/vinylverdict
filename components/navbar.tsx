"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SpotifyLoginButton } from "./spotify-login-button"
import { LogOut, Menu, User, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { VinylLogo } from "./vinyl-logo"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()

  // Don't show navbar on callback page
  if (pathname === "/callback") {
    return null
  }

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      // Get the navbar height to offset the scroll position
      const navbar = document.querySelector("header")
      const navbarHeight = navbar ? navbar.clientHeight : 0

      const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: sectionPosition - navbarHeight,
        behavior: "smooth",
      })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Purple gradient line - now 1px */}
      <div className="h-[1px] w-full bg-purple-gradient"></div>

      <div className="bg-black/80 backdrop-blur-md border-b border-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1">
              <VinylLogo size={48} />
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-purple-gradient tracking-tight">VinylVerdict</span>
                <span className="text-xs text-zinc-400 -mt-1">Personalized Music Taste Critic</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {/* Navigation links - conditionally shown based on path */}
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                Home
              </Link>

              {!pathname.startsWith("/dashboard") && (
                <>
                  <button
                    onClick={(e) => scrollToSection(e, "features")}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </button>
                  <button
                    onClick={(e) => scrollToSection(e, "testimonials")}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Testimonials
                  </button>
                </>
              )}

              {/* Authentication buttons */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {!pathname.startsWith("/dashboard") && (
                    <Link
                      href="/dashboard"
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                    >
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
              ) : (
                <SpotifyLoginButton text="Log in" className="py-2 px-6 text-base" />
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 flex flex-col gap-4">
              {/* Navigation links - conditionally shown based on path */}
              <Link
                href="/"
                className="text-zinc-400 hover:text-white transition-colors py-2 text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {!pathname.startsWith("/dashboard") && (
                <>
                  <button
                    className="text-zinc-400 hover:text-white transition-colors py-2 text-left"
                    onClick={(e) => {
                      scrollToSection(e, "features")
                      setIsMenuOpen(false)
                    }}
                  >
                    How It Works
                  </button>
                  <button
                    className="text-zinc-400 hover:text-white transition-colors py-2 text-left"
                    onClick={(e) => {
                      scrollToSection(e, "testimonials")
                      setIsMenuOpen(false)
                    }}
                  >
                    Testimonials
                  </button>
                </>
              )}

              {/* Authentication buttons */}
              {isAuthenticated ? (
                <>
                  {!pathname.startsWith("/dashboard") && (
                    <Link
                      href="/dashboard"
                      className="text-zinc-400 hover:text-white transition-colors py-2 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <button
                    className="relative overflow-hidden btn-gradient holographic-shimmer text-white font-bold py-2 px-6 text-base rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg justify-start w-full"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="pt-2">
                  <SpotifyLoginButton text="Log in" />
                </div>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
