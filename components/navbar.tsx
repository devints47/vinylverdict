"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SpotifyLoginButton } from "./spotify-login-button"
import { Home, LogOut, Menu, User, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { VinylLogo } from "./vinyl-logo"
import { PolicyNavLink } from "./policy-nav-link"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()

  // Don't show navbar on callback page
  if (pathname === "/callback") {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <VinylLogo size={48} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-purple-gradient tracking-tight">SnobScore</span>
              <span className="text-xs text-zinc-400 -mt-1">Personalized Music Taste Critic</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAuthenticated && pathname === "/" && (
              <>
                <PolicyNavLink href="#features" className="text-zinc-400 hover:text-white transition-colors">
                  Features
                </PolicyNavLink>
                <PolicyNavLink href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors">
                  How It Works
                </PolicyNavLink>
                <PolicyNavLink href="#testimonials" className="text-zinc-400 hover:text-white transition-colors">
                  Testimonials
                </PolicyNavLink>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                  <Home size={18} />
                  <span>Home</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </Link>
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-white flex items-center gap-2"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
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
            {!isAuthenticated && pathname === "/" && (
              <>
                <PolicyNavLink
                  href="#features"
                  className="text-zinc-400 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </PolicyNavLink>
                <PolicyNavLink
                  href="#how-it-works"
                  className="text-zinc-400 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </PolicyNavLink>
                <PolicyNavLink
                  href="#testimonials"
                  className="text-zinc-400 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </PolicyNavLink>
              </>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className="text-zinc-400 hover:text-white transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={18} />
                  <span>Home</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="text-zinc-400 hover:text-white transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </Link>
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-white justify-start py-2 h-auto flex items-center gap-2"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="pt-2">
                <SpotifyLoginButton text="Log in" />
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
