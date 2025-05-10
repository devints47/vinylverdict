"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface ScrollToTopProps {
  children: React.ReactNode
}

export function ScrollToTop({ children }: ScrollToTopProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0)
  }, [pathname]) // Re-run when pathname changes

  return <>{children}</>
}
