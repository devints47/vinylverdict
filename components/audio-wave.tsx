"use client"

import { useEffect, useRef, useCallback, memo } from "react"

const AudioWave = memo(function AudioWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const barsRef = useRef<number[]>([])
  const isInitializedRef = useRef(false)

  // Memoize the animation function to prevent recreating it on each render
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barCount = 40
    const barWidth = width / barCount - 2
    const bars = barsRef.current

    // Clear with minimal area
    ctx.clearRect(0, 0, width, height)

    // Chromatic color palette
    const purpleColors = [
      "#9333ea", // --purple-gradient-start
      "#a855f7", // --purple-gradient-mid
      "#c026d3", // --purple-gradient-end
      "#d946ef", // --purple-accent
      "#f0abfc", // --purple-highlight
    ]

    // Update bar heights with reduced calculations
    for (let i = 0; i < barCount; i++) {
      // Randomly adjust bar height with more variation
      bars[i] += Math.random() * 12 - 6

      // Keep bars within bounds
      bars[i] = Math.max(10, Math.min(70, bars[i]))

      // Draw bar
      const x = i * (barWidth + 2)
      const barHeight = bars[i]
      const y = (height - barHeight) / 2

      // Simplified color selection - reduce calculations
      const colorIndex1 = i % purpleColors.length
      const colorIndex2 = (i + 2) % purpleColors.length

      // Get colors from our palette
      const color1 = purpleColors[colorIndex1]
      const color2 = purpleColors[colorIndex2]

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      gradient.addColorStop(0, color1)
      gradient.addColorStop(1, color2)

      // Apply the gradient
      ctx.fillStyle = gradient

      // Add glow effect - but only when not in power saving mode
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!prefersReducedMotion) {
        ctx.shadowColor = color1
        ctx.shadowBlur = 5
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      // Draw the bar with rounded corners for a more polished look
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 2)
      ctx.fill()

      // Reset shadow for next bar
      ctx.shadowBlur = 0
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Add a media query check to hide on smaller screens, but only on the dashboard page
    const mediaQuery = window.matchMedia("(max-width: 1350px)")
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // Check if we're on the dashboard page by looking at the URL
      const isDashboardPage = window.location.pathname.includes("/dashboard")

      if (e.matches && isDashboardPage) {
        // If screen is smaller than 1350px AND we're on dashboard, hide the canvas
        canvas.style.display = "none"
      } else {
        // Otherwise show it
        canvas.style.display = "block"
      }
    }

    // Initial check
    handleMediaChange(mediaQuery)

    // Add listener for changes
    mediaQuery.addEventListener("change", handleMediaChange)

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = 80

    // Initialize bars only once
    if (!isInitializedRef.current) {
      const barCount = 40
      // Initialize bars with random heights
      for (let i = 0; i < barCount; i++) {
        barsRef.current.push(Math.random() * 50 + 10)
      }
      isInitializedRef.current = true
    }

    // Start animation with requestAnimationFrame
    animationRef.current = requestAnimationFrame(animate)

    // Handle resize with debounce
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (canvas) {
          canvas.width = canvas.offsetWidth
          // Also check media query on resize
          handleMediaChange(mediaQuery)
        }
      }, 100) // 100ms debounce
    }

    window.addEventListener("resize", handleResize)

    // Reduce animation frame rate when tab is not visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Stop animation when tab is not visible
        cancelAnimationFrame(animationRef.current)
      } else {
        // Resume animation when tab becomes visible
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
      mediaQuery.removeEventListener("change", handleMediaChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearTimeout(resizeTimeout)
    }
  }, [animate])

  return <canvas ref={canvasRef} className="w-full h-20" aria-hidden="true" />
})

export { AudioWave }
