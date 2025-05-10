"use client"

import { useEffect, useState, memo } from "react"

function TechGridBackgroundComponent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mediaQuery.matches)

    // Delay rendering to improve initial page load
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Don't render anything if not visible yet
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url(/tech-grid.svg)",
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Accent elements - only show if not reduced motion */}
      {!isReducedMotion && (
        <>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "url(/tech-grid-accents.svg)",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          />

          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url(/tech-grid-glows.svg)",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              animation: "pulse 8s ease-in-out infinite alternate",
            }}
          />
        </>
      )}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const TechGridBackground = memo(TechGridBackgroundComponent)
