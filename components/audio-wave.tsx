"use client"

import { useEffect, useRef, useCallback, memo } from "react"

const AudioWave = memo(function AudioWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const barsRef = useRef<number[]>([])
  const targetHeightsRef = useRef<number[]>([])
  const isInitializedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastFrameTimeRef = useRef<number>(0)
  const colorOffsetRef = useRef(0)
  const fpsInterval = 1000 / 60 // Target 60 FPS

  // Memoize the animation function to prevent recreating it on each render
  const animate = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      // Calculate elapsed time
      const elapsed = timestamp - lastFrameTimeRef.current

      // Only render if enough time has passed
      if (elapsed > fpsInterval) {
        // Remember when we last rendered
        lastFrameTimeRef.current = timestamp - (elapsed % fpsInterval)

        // Use alpha: true to ensure transparency
        const ctx = canvas.getContext("2d", { alpha: true })
        if (!ctx) return

        const width = canvas.width
        const height = canvas.height
        const barCount = 90 // Increased bar count for skinnier bars
        const barWidth = width / barCount - 1.2 // Reduced width even more
        const bars = barsRef.current
        const targetHeights = targetHeightsRef.current

        // Clear with transparent background
        ctx.clearRect(0, 0, width, height)

        // Update color offset for moving gradient - slowed down by 30%
        colorOffsetRef.current = (colorOffsetRef.current + 0.35) % barCount // Reduced from 0.5 to 0.35

        // Purple color palette matching the image
        const purpleColors = [
          "#9333ea", // Deep purple
          "#a855f7", // Medium purple
          "#c026d3", // Bright purple
          "#d946ef", // Pink-purple
          "#f0abfc", // Light pink-purple
        ]

        // Update target heights more frequently (15% chance per frame)
        for (let i = 0; i < barCount; i++) {
          if (Math.random() < 0.15) {
            // Create more randomness with wider range and occasional peaks
            if (Math.random() < 0.1) {
              // 10% chance for a high peak or very low valley
              if (Math.random() < 0.5) {
                // High peak - increased maximum height
                targetHeights[i] = Math.random() * 25 + 65 // Range from 65 to 90 (increased from 60-80)
              } else {
                // Low valley
                targetHeights[i] = Math.random() * 5 + 2 // Range from 2 to 7
              }
            } else {
              // Normal range
              targetHeights[i] = Math.random() * 50 + 10 // Range from 10 to 60
            }
          }
        }

        // Update bar heights with faster transitions
        for (let i = 0; i < barCount; i++) {
          // Faster easing towards target height
          const diff = targetHeights[i] - bars[i]
          bars[i] += diff * 0.15 // Responsive movement

          // Add small random jitter for more liveliness
          bars[i] += Math.random() * 2 - 1

          // Keep bars within expanded bounds - increased maximum height
          bars[i] = Math.max(2, Math.min(90, bars[i])) // Increased from 80 to 90

          // Draw bar
          const x = i * (barWidth + 1.2)
          const barHeight = bars[i]
          const y = (height - barHeight) / 2

          // Color selection with moving gradient effect
          // Calculate color index based on position and moving offset
          const colorPosition = (i + colorOffsetRef.current) % barCount
          const colorIndex = Math.floor((colorPosition / barCount) * purpleColors.length)
          const nextColorIndex = (colorIndex + 1) % purpleColors.length

          // Calculate how far we are between the current color and the next
          const colorProgress = (colorPosition / barCount) * purpleColors.length - colorIndex

          // Interpolate between colors for smoother gradient
          const baseColor = purpleColors[colorIndex]
          const nextColor = purpleColors[nextColorIndex]

          // Create gradient - vertical gradient from lighter to darker
          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)

          // Start with current color
          gradient.addColorStop(0, baseColor)

          // End with next color
          gradient.addColorStop(1, nextColor)

          // Apply the gradient
          ctx.fillStyle = gradient

          // Add stronger glow effect to match the image
          ctx.shadowColor = baseColor
          ctx.shadowBlur = 8 // Increased blur for more prominent glow
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0

          // Draw the bar with more rounded corners to match the image
          const xPos = Math.round(x) + 0.5
          const yPos = Math.round(y) + 0.5
          const barWidthRounded = Math.max(1, Math.round(barWidth)) // Ensure minimum width of 1px
          const barHeightRounded = Math.round(barHeight)

          ctx.beginPath()
          ctx.roundRect(xPos, yPos, barWidthRounded, barHeightRounded, 2) // Reduced corner radius for skinnier bars
          ctx.fill()

          // Reset shadow for next bar
          ctx.shadowBlur = 0
        }
      }

      // Request next frame
      animationRef.current = requestAnimationFrame(animate)
    },
    [fpsInterval],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting
        if (isVisible) {
          if (!animationRef.current) {
            lastFrameTimeRef.current = performance.now()
            animationRef.current = requestAnimationFrame(animate)
          }
        } else {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = 0
          }
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(canvas)
    return () => observer.disconnect()
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Add a media query check to hide on smaller screens, but only on the dashboard page
    const mediaQuery = window.matchMedia("(max-width: 1350px)")
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // Check if we're on the dashboard page by looking at the URL
      const isDashboardPage = window.location.pathname.includes("/dashboard")

      if (e.matches && isDashboardPage) {
        // If screen is smaller than 1350px AND we're on dashboard, hide the canvas
        container.style.display = "none"
      } else {
        // Otherwise show it
        container.style.display = "block"
      }
    }

    // Initial check
    handleMediaChange(mediaQuery)

    // Add listener for changes
    mediaQuery.addEventListener("change", handleMediaChange)

    // Set canvas dimensions - use a fixed minimum width for better quality
    const minWidth = 650
    const containerWidth = container.offsetWidth

    // Use the larger of the container width or our minimum width
    const canvasWidth = Math.max(containerWidth, minWidth)
    canvas.width = canvasWidth
    canvas.height = 80

    // If the canvas is wider than the container, center it
    if (canvasWidth > containerWidth) {
      canvas.style.marginLeft = `${-(canvasWidth - containerWidth) / 2}px`
      canvas.style.width = `${canvasWidth}px`
    }

    // Set background to black to match the image
    canvas.style.background = "black"

    // Initialize bars only once
    if (!isInitializedRef.current) {
      const barCount = 90 // Increased bar count for skinnier bars

      // Initialize bars with varied heights to match the image pattern
      for (let i = 0; i < barCount; i++) {
        // Create a wave-like pattern for initial state
        const baseHeight = 30
        const variance = 25 // Increased variance for more dramatic initial state
        const frequency = 0.15

        // Create a sine wave with some randomness
        const height = baseHeight + Math.sin(i * frequency) * variance + (Math.random() * 10 - 5)

        barsRef.current.push(height)
        targetHeightsRef.current.push(height)
      }

      isInitializedRef.current = true
    }

    // Start animation with requestAnimationFrame
    lastFrameTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(animate)

    // Handle resize with debounce
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (canvas && container) {
          const containerWidth = container.offsetWidth
          const canvasWidth = Math.max(containerWidth, minWidth)
          canvas.width = canvasWidth

          // If the canvas is wider than the container, center it
          if (canvasWidth > containerWidth) {
            canvas.style.marginLeft = `${-(canvasWidth - containerWidth) / 2}px`
            canvas.style.width = `${canvasWidth}px`
          } else {
            canvas.style.marginLeft = "0"
            canvas.style.width = "100%"
          }

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
        lastFrameTimeRef.current = performance.now()
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

  return (
    <div ref={containerRef} className="w-full overflow-hidden" style={{ background: "black" }}>
      <canvas ref={canvasRef} className="h-20" aria-hidden="true" />
    </div>
  )
})

export { AudioWave }
