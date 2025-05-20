"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { VinylLogo } from "./vinyl-logo"
import { AuthButtonWrapper } from "./auth-button-wrapper"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
              <AuthButtonWrapper />
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

              {/* Authentication buttons for mobile */}
              <div className="pt-2">
                <AuthButtonWrapper />
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
