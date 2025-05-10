"use client"

import { useEffect, useRef } from "react"

export function AudioWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = 80

    const width = canvas.width
    const height = canvas.height

    // Create bars
    const barCount = 40
    const barWidth = width / barCount - 2
    const bars: number[] = []

    // Initialize bars with random heights
    for (let i = 0; i < barCount; i++) {
      bars.push(Math.random() * 50 + 10)
    }

    // Color animation variables
    let hueRotation = 0
    let colorPhase = 0

    // Chromatic color palette
    const purpleColors = [
      "#9333ea", // --purple-gradient-start
      "#a855f7", // --purple-gradient-mid
      "#c026d3", // --purple-gradient-end
      "#d946ef", // --purple-accent
      "#f0abfc", // --purple-highlight
    ]

    // Animate bars
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Update color animation
      colorPhase += 0.01
      hueRotation = Math.sin(colorPhase) * 15 // -15 to 15 degrees hue rotation

      // Update bar heights
      for (let i = 0; i < barCount; i++) {
        // Randomly adjust bar height with more variation
        bars[i] += Math.random() * 12 - 6

        // Keep bars within bounds
        bars[i] = Math.max(10, Math.min(70, bars[i]))

        // Draw bar
        const x = i * (barWidth + 2)
        const barHeight = bars[i]
        const y = (height - barHeight) / 2

        // Create dynamic gradient based on position and time
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)

        // Calculate color indices with offset based on position and time
        const colorIndex1 = Math.floor(((i / barCount) * 3 + colorPhase) % purpleColors.length)
        const colorIndex2 = Math.floor(((i / barCount) * 3 + colorPhase + 2) % purpleColors.length)

        // Get colors from our palette
        const color1 = purpleColors[colorIndex1]
        const color2 = purpleColors[colorIndex2]

        gradient.addColorStop(0, color1)
        gradient.addColorStop(1, color2)

        // Apply the gradient
        ctx.fillStyle = gradient

        // Add glow effect
        ctx.shadowColor = color1
        ctx.shadowBlur = 5
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        // Draw the bar with rounded corners for a more polished look
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 2)
        ctx.fill()

        // Reset shadow for next bar
        ctx.shadowBlur = 0
      }

      // Removed the shimmer effect code that was here

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-20 hidden md:block" aria-hidden="true" />
}
