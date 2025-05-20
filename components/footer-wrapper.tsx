"use client"

import { useEffect, useState } from "react"
import { Footer } from "./footer"

export function FooterWrapper() {
  const [mounted, setMounted] = useState(false)

  // Only show footer after hydration to prevent layout shift
  useEffect(() => {
    setMounted(true)
  }, [])

  // Before hydration, render a placeholder with the same dimensions
  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-black border-t border-zinc-800">{/* Placeholder for footer content */}</div>
    )
  }

  return <Footer />
}
