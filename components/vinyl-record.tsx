"use client"

import { useEffect, useRef, memo } from "react"

// Define the vinyl design type
export interface VinylDesign {
  id: string
  name: string
  labelColor: string
  faceType: "snob" | "happy" | "cool" | "surprised"
  labelText: string
}

// Define flip direction for animation
type FlipDirection = "left" | "right" | "none"

interface VinylRecordProps {
  design?: VinylDesign
  size?: number
  className?: string
  rpm?: number // Added RPM prop with default of 33 1/3
  flipDirection?: FlipDirection
  isTransitioning?: boolean
  onClick?: () => void // Add onClick handler prop
}

// Default design if none provided
const DEFAULT_DESIGN: VinylDesign = {
  id: "snob-classic",
  name: "The Critic",
  labelColor: "purple",
  faceType: "snob",
  labelText: "VINYLVERDICT • PREMIUM VINYL • AUDIOPHILE EDITION •",
}

// Memoize the VinylRecord component to prevent unnecessary re-renders
const VinylRecord = memo(function VinylRecord({
  design = DEFAULT_DESIGN,
  size,
  className = "",
  rpm = 33.33, // Standard LP speed
  flipDirection = "none",
  isTransitioning = false,
  onClick, // Add onClick handler
}: VinylRecordProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const scratchesRef = useRef<
    Array<{
      radius: number
      startAngle: number
      arcLength: number
      opacity: number
      width: number
    }>
  >([])
  const isVisibleRef = useRef(true)
  const gradientColorsRef = useRef<string[]>([])
  const flipProgressRef = useRef(0)
  const flipStartTimeRef = useRef(0)
  const flipDurationRef = useRef(500) // 500ms for flip animation

  useEffect(() => {
    // Use a ResizeObserver instead of window resize event
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const containerWidth = canvas.parentElement?.clientWidth || 300
        const canvasSize = size || containerWidth
        canvas.width = canvasSize
        canvas.height = canvasSize
      }, 100),
    )

    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement)
    }

    return () => resizeObserver.disconnect()
  }, [size])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Set canvas dimensions - responsive to container size
    const containerWidth = canvas.parentElement?.clientWidth || 300
    const canvasSize = size || containerWidth
    canvas.width = canvasSize
    canvas.height = canvasSize

    // Draw vinyl record
    const centerX = canvasSize / 2
    const centerY = canvasSize / 2
    const outerRadius = canvasSize / 2 - 10
    const labelRadius = outerRadius / 3

    // Reset scratches when design changes
    if (isTransitioning && flipDirection !== "none") {
      scratchesRef.current = []
      gradientColorsRef.current = []
      flipStartTimeRef.current = performance.now()
    }

    // Generate random scratches if not already generated
    if (scratchesRef.current.length === 0) {
      // Generate between 5-8 scratches
      const scratchCount = 5 + Math.floor(Math.random() * 4)

      for (let i = 0; i < scratchCount; i++) {
        // Place scratches only in the groove area (between label and outer edge)
        const minRadius = labelRadius + 10
        const maxRadius = outerRadius - 10
        const radius = minRadius + Math.random() * (maxRadius - minRadius)

        // Random starting angle
        const startAngle = Math.random() * Math.PI * 2

        // Random arc length (short scratches)
        const arcLength = (0.05 + Math.random() * 0.15) * Math.PI

        // Random opacity (subtle)
        const opacity = 0.1 + Math.random() * 0.2

        // Random line width (thin)
        const width = 0.5 + Math.random() * 1

        scratchesRef.current.push({
          radius,
          startAngle,
          arcLength,
          opacity,
          width,
        })
      }
    }

    // Create gradient colors for the label based on design - only compute once
    if (gradientColorsRef.current.length === 0) {
      switch (design.labelColor) {
        case "teal":
          gradientColorsRef.current = ["#14b8a6", "#0d9488", "#5eead4", "#2dd4bf", "#0f766e", "#14b8a6"]
          break
        case "pink":
          gradientColorsRef.current = ["#ec4899", "#db2777", "#fbcfe8", "#f472b6", "#be185d", "#ec4899"]
          break
        case "red":
          gradientColorsRef.current = ["#ef4444", "#dc2626", "#fca5a5", "#f87171", "#b91c1c", "#ef4444"]
          break
        case "blue":
          gradientColorsRef.current = ["#3b82f6", "#2563eb", "#93c5fd", "#60a5fa", "#1d4ed8", "#3b82f6"]
          break
        case "purple":
        default:
          gradientColorsRef.current = ["#A855F7", "#9333EA", "#C084FC", "#8B5CF6", "#D946EF", "#A855F7"]
          break
      }
    }

    // Function to create a gradient with current animation offset
    const createGradient = (offset = 0) => {
      const gradient = ctx.createLinearGradient(
        centerX - labelRadius,
        centerY - labelRadius,
        centerX + labelRadius,
        centerY + labelRadius,
      )

      // Calculate positions with offset
      gradientColorsRef.current.forEach((color, index) => {
        const position = (index / (gradientColorsRef.current.length - 1) + offset) % 1
        gradient.addColorStop(position, color)
      })

      return gradient
    }

    // Function to draw the face based on design
    const drawFace = () => {
      // Draw face based on type
      ctx.strokeStyle = "black"
      ctx.lineWidth = 1.5

      // Calculate positions based on label size
      const eyeOffsetX = labelRadius * 0.4
      const eyeY = centerY - labelRadius * 0.1
      const eyeWidth = labelRadius * 0.3
      const eyeHeight = labelRadius * 0.25

      switch (design.faceType) {
        case "happy":
          // Happy face with round glasses
          // Eyes
          ctx.beginPath()
          ctx.arc(centerX - eyeOffsetX, eyeY, eyeWidth * 0.8, 0, Math.PI * 2)
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(centerX + eyeOffsetX, eyeY, eyeWidth * 0.8, 0, Math.PI * 2)
          ctx.stroke()

          // Bridge
          ctx.beginPath()
          ctx.moveTo(centerX - eyeOffsetX + eyeWidth * 0.8, eyeY)
          ctx.lineTo(centerX + eyeOffsetX - eyeWidth * 0.8, eyeY)
          ctx.stroke()

          // Smile
          ctx.beginPath()
          ctx.arc(centerX, centerY + labelRadius * 0.1, labelRadius * 0.4, 0.1 * Math.PI, 0.9 * Math.PI, false)
          ctx.stroke()
          break

        case "cool":
          // Cool face with sunglasses
          // Sunglasses
          ctx.beginPath()
          ctx.rect(centerX - eyeOffsetX - eyeWidth, eyeY - eyeHeight, eyeWidth * 2, eyeHeight * 2)
          ctx.rect(centerX + eyeOffsetX - eyeWidth, eyeY - eyeHeight, eyeWidth * 2, eyeHeight * 2)
          ctx.fill()

          // Bridge
          ctx.beginPath()
          ctx.moveTo(centerX - eyeOffsetX + eyeWidth, eyeY)
          ctx.lineTo(centerX + eyeOffsetX - eyeWidth, eyeY)
          ctx.stroke()

          // Smirk
          ctx.beginPath()
          ctx.moveTo(centerX - labelRadius * 0.3, centerY + labelRadius * 0.3)
          ctx.quadraticCurveTo(
            centerX + labelRadius * 0.2,
            centerY + labelRadius * 0.2,
            centerX + labelRadius * 0.4,
            centerY + labelRadius * 0.3,
          )
          ctx.stroke()
          break

        case "surprised":
          // Surprised face
          // Wide eyes
          ctx.beginPath()
          ctx.ellipse(centerX - eyeOffsetX, eyeY, eyeWidth, eyeHeight * 1.2, 0, 0, Math.PI * 2)
          ctx.stroke()

          ctx.beginPath()
          ctx.ellipse(centerX + eyeOffsetX, eyeY, eyeWidth, eyeHeight * 1.2, 0, 0, Math.PI * 2)
          ctx.stroke()

          // Bridge
          ctx.beginPath()
          ctx.moveTo(centerX - eyeOffsetX + eyeWidth, eyeY)
          ctx.lineTo(centerX + eyeOffsetX - eyeWidth, eyeY)
          ctx.stroke()

          // Surprised mouth
          ctx.beginPath()
          ctx.arc(centerX, centerY + labelRadius * 0.3, labelRadius * 0.2, 0, Math.PI * 2)
          ctx.stroke()
          break

        case "snob":
        default:
          // Original Music Snob face
          // Left lens
          ctx.beginPath()
          ctx.ellipse(centerX - eyeOffsetX, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2)
          ctx.stroke()

          // Right lens
          ctx.beginPath()
          ctx.ellipse(centerX + eyeOffsetX, eyeY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2)
          ctx.stroke()

          // Bridge
          ctx.beginPath()
          ctx.moveTo(centerX - eyeOffsetX + eyeWidth, eyeY)
          ctx.lineTo(centerX + eyeOffsetX - eyeWidth, eyeY)
          ctx.stroke()

          // Draw raised eyebrow
          ctx.beginPath()
          ctx.moveTo(centerX - eyeOffsetX - eyeWidth, eyeY - eyeHeight * 1.5)
          ctx.quadraticCurveTo(
            centerX - eyeOffsetX,
            eyeY - eyeHeight * 2.5,
            centerX - eyeOffsetX + eyeWidth * 1.5,
            eyeY - eyeHeight * 1.5,
          )
          ctx.stroke()

          // Draw unimpressed mouth
          ctx.beginPath()
          ctx.moveTo(centerX - labelRadius * 0.5, centerY + labelRadius * 0.5)
          ctx.quadraticCurveTo(
            centerX,
            centerY + labelRadius * 0.4,
            centerX + labelRadius * 0.5,
            centerY + labelRadius * 0.5,
          )
          ctx.stroke()
          break
      }
    }

    // Draw vinyl label text
    const drawLabelText = () => {
      ctx.save()
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.font = `${labelRadius * 0.15}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Draw circular text around the edge of the label
      const text = design.labelText
      const radius = labelRadius * 0.85
      const angleStep = (Math.PI * 2) / text.length

      for (let i = 0; i < text.length; i++) {
        const angle = i * angleStep - Math.PI / 2
        ctx.save()
        ctx.translate(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
        ctx.rotate(angle + Math.PI / 2)
        ctx.fillText(text[i], 0, 0)
        ctx.restore()
      }

      ctx.restore()
    }

    // Draw vinyl reflection
    const drawReflection = (totalElapsedTime: number) => {
      // Create a shine effect that moves very slowly
      // Use a much slower cycle for the reflection - once every 20 seconds
      const reflectionCycleMs = 20000 // 20 seconds per full reflection cycle
      const reflectionPhase = (totalElapsedTime % reflectionCycleMs) / reflectionCycleMs

      // Use sine wave to create a smooth transition
      const offset = (Math.sin(reflectionPhase * Math.PI * 2) + 1) / 2

      const gradient = ctx.createLinearGradient(
        centerX - outerRadius,
        centerY - outerRadius,
        centerX + outerRadius,
        centerY + outerRadius,
      )

      gradient.addColorStop(Math.max(0, offset - 0.1), "rgba(255, 255, 255, 0)")
      gradient.addColorStop(offset, "rgba(255, 255, 255, 0.15)")
      gradient.addColorStop(Math.min(1, offset + 0.1), "rgba(255, 255, 255, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw record player arm (stationary)
    const drawTonearm = () => {
      // Save the current context state
      ctx.save()

      // Tonearm base position (top right of the record)
      const baseX = centerX + outerRadius * 0.9
      const baseY = centerY - outerRadius * 0.9

      // Draw tonearm base (circular)
      const baseGradient = ctx.createRadialGradient(baseX, baseY, 0, baseX, baseY, 12)
      baseGradient.addColorStop(0, "#555")
      baseGradient.addColorStop(1, "#333")

      ctx.beginPath()
      ctx.arc(baseX, baseY, 12, 0, Math.PI * 2)
      ctx.fillStyle = baseGradient
      ctx.fill()

      // Add highlight to base
      ctx.beginPath()
      ctx.arc(baseX - 3, baseY - 3, 4, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
      ctx.fill()

      // Fixed target position - outer edge of the record
      // Position it at the shortest length (closest to the edge)
      const targetX = centerX + outerRadius * 0.7
      const targetY = centerY - outerRadius * 0.2

      const angle = Math.atan2(targetY - baseY, targetX - baseX)

      // Draw the main arm
      ctx.beginPath()
      ctx.moveTo(baseX, baseY)

      // Control points for the curved arm
      const cp1x = baseX + Math.cos(angle) * outerRadius * 0.3
      const cp1y = baseY + Math.sin(angle) * outerRadius * 0.3
      const cp2x = targetX - Math.cos(angle) * outerRadius * 0.2
      const cp2y = targetY - Math.sin(angle) * outerRadius * 0.2

      // Draw a curved bezier for the arm
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY)

      // Style and stroke the arm
      ctx.lineWidth = 3
      ctx.strokeStyle = "#333"
      ctx.stroke()

      // Add a thin highlight along the arm
      ctx.beginPath()
      ctx.moveTo(baseX, baseY)
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY)
      ctx.lineWidth = 1
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.stroke()

      // Draw the cartridge/headshell at the end of the arm
      ctx.save()
      ctx.translate(targetX, targetY)
      ctx.rotate(angle)

      // Headshell
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(15, -5)
      ctx.lineTo(15, 5)
      ctx.closePath()
      ctx.fillStyle = "#222"
      ctx.fill()

      // Cartridge
      ctx.fillStyle = "#111"
      ctx.fillRect(15, -4, 8, 8)

      // Needle
      ctx.beginPath()
      ctx.moveTo(23, 0)
      ctx.lineTo(26, 0)
      ctx.lineWidth = 1
      ctx.strokeStyle = "#DDD"
      ctx.stroke()

      // Add a subtle shadow under the needle
      ctx.beginPath()
      ctx.arc(26, 0, 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fill()

      ctx.restore()

      // Restore the context state
      ctx.restore()
    }

    // Draw record player platter/base
    const drawTurntablePlatter = () => {
      // Save the current context state
      ctx.save()

      // Draw the turntable platter (slightly larger than the record)
      const platterRadius = outerRadius + 15

      // Create a gradient for the platter
      const platterGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        outerRadius - 5,
        centerX,
        centerY,
        platterRadius,
      )
      platterGradient.addColorStop(0, "#222")
      platterGradient.addColorStop(1, "#111")

      // Draw the main platter circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, platterRadius, 0, Math.PI * 2)
      ctx.fillStyle = platterGradient
      ctx.fill()

      // Add a subtle edge highlight
      ctx.beginPath()
      ctx.arc(centerX, centerY, platterRadius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Add a felt mat under the record
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius + 5, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(30, 30, 30, 0.8)"
      ctx.fill()

      // Add texture to the felt mat (subtle circular pattern)
      for (let r = outerRadius; r > outerRadius - 20; r -= 4) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Add a spindle in the center
      ctx.beginPath()
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#555"
      ctx.fill()

      // Add highlight to spindle
      ctx.beginPath()
      ctx.arc(centerX - 1, centerY - 1, 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fill()

      // Restore the context state
      ctx.restore()
    }

    // Draw scratches and imperfections
    const drawScratches = () => {
      scratchesRef.current.forEach((scratch) => {
        ctx.beginPath()
        ctx.arc(centerX, centerY, scratch.radius, scratch.startAngle, scratch.startAngle + scratch.arcLength)
        ctx.strokeStyle = `rgba(255, 255, 255, ${scratch.opacity})`
        ctx.lineWidth = scratch.width
        ctx.stroke()
      })

      // Add a few dust particles
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = labelRadius + Math.random() * (outerRadius - labelRadius - 5)
        const size = 0.5 + Math.random() * 1
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, 0.2)`
        ctx.fill()
      }
    }

    // Calculate flip progress for animation
    const calculateFlipProgress = (timestamp: number) => {
      if (flipDirection === "none" || !isTransitioning) return 0

      const elapsed = timestamp - flipStartTimeRef.current
      const progress = Math.min(elapsed / flipDurationRef.current, 1)

      // Normalize to 0-1 range for the first half, then 1-0 for the second half
      return progress <= 0.5 ? progress * 2 : 2 - progress * 2
    }

    // Draw outer black vinyl with flip animation
    const drawVinyl = (rotation = 0, gradientOffset = 0, totalElapsedTime = 0, timestamp = 0) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasSize, canvasSize)

      // Calculate flip progress for animation
      const flipProgress = calculateFlipProgress(timestamp)
      flipProgressRef.current = flipProgress

      // First draw the turntable platter (base layer)
      drawTurntablePlatter()

      // Apply flip transformation if transitioning
      ctx.save()

      if (isTransitioning && flipDirection !== "none") {
        // Scale the record horizontally based on flip progress (0-1)
        // This creates the illusion of the record flipping
        const scaleX = Math.max(0.01, 1 - flipProgress)
        ctx.translate(centerX, centerY)
        ctx.scale(scaleX, 1)
        ctx.translate(-centerX, -centerY)
      }

      // Rotate canvas for the vinyl
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)
      ctx.translate(-centerX, -centerY)

      // Draw outer black vinyl
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI)
      ctx.fillStyle = "#191414"
      ctx.fill()

      // Add a subtle outer rim highlight
      const rimGradient = ctx.createRadialGradient(centerX, centerY, outerRadius - 2, centerX, centerY, outerRadius)
      rimGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
      rimGradient.addColorStop(1, "rgba(255, 255, 255, 0.3)")

      ctx.fillStyle = rimGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw grooves with varying opacity for more depth
      // Simplified to fewer grooves with more spacing to reduce complexity
      for (let i = outerRadius - 10; i > outerRadius / 3; i -= 6) {
        const opacity = 0.08
        ctx.beginPath()
        ctx.arc(centerX, centerY, i, 0, 2 * Math.PI)
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw scratches and imperfections
      drawScratches()

      // Draw label with animated gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, labelRadius, 0, 2 * Math.PI)
      ctx.fillStyle = createGradient(gradientOffset)
      ctx.fill()

      // Add a subtle embossed effect to the label
      const labelEdgeGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        labelRadius - 2,
        centerX,
        centerY,
        labelRadius,
      )
      labelEdgeGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
      labelEdgeGradient.addColorStop(1, "rgba(0, 0, 0, 0.3)")

      ctx.fillStyle = labelEdgeGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, labelRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw label text
      drawLabelText()

      // Draw face on the label
      drawFace()

      // Draw center hole with a metallic look
      const holeGradient = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 5)
      holeGradient.addColorStop(0, "#777")
      holeGradient.addColorStop(1, "#333")

      ctx.beginPath()
      ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = holeGradient
      ctx.fill()

      // Add a highlight to the center hole
      ctx.beginPath()
      ctx.arc(centerX - 1, centerY - 1, 2, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fill()

      // Restore context state
      ctx.restore()

      // Draw the reflection (not affected by vinyl rotation)
      drawReflection(totalElapsedTime)

      // Draw the stationary tonearm (not affected by vinyl rotation)
      // Only draw if not in the middle of a flip
      if (flipProgress < 0.5) {
        drawTonearm()
      }
    }

    // Calculate rotation speed based on RPM
    // RPM = revolutions per minute
    // Convert to radians per millisecond for our animation
    const radiansPerMs = (rpm * 2 * Math.PI) / (60 * 1000)

    // Start rotation and gradient animation with time-based movement
    let rotation = 0
    let gradientOffset = 0
    let totalElapsedTime = 0

    const animate = (timestamp: number) => {
      // Skip animation if not visible
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Initialize lastTimeRef on first frame
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp
      }

      // Calculate time elapsed since last frame in milliseconds
      const elapsed = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      // Track total elapsed time for slow reflection cycle
      totalElapsedTime += elapsed

      // Update rotation based on elapsed time and RPM
      // Slow down or stop rotation during flip animation
      if (isTransitioning && flipDirection !== "none") {
        const flipProgress = calculateFlipProgress(timestamp)
        // Slow down rotation as flip progresses
        rotation += radiansPerMs * elapsed * Math.max(0, 1 - flipProgress * 2)
      } else {
        rotation += radiansPerMs * elapsed
      }

      // Keep rotation within 0-2π range to avoid floating point issues over time
      rotation %= 2 * Math.PI

      // Update gradient offset at a slower rate
      gradientOffset += (radiansPerMs * elapsed * 0.5) % 1

      drawVinyl(rotation, gradientOffset, totalElapsedTime, timestamp)
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start the animation
    animationRef.current = requestAnimationFrame(animate)

    // Handle resize with debounce
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const newWidth = canvas.parentElement?.clientWidth || 300
        canvas.width = newWidth
        canvas.height = newWidth
      }, 100) // 100ms debounce
    }

    window.addEventListener("resize", handleResize)

    // Handle visibility changes to pause animation when not visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        isVisibleRef.current = false
      } else {
        isVisibleRef.current = true
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Handle intersection observer to pause animation when not in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting
      },
      { threshold: 0.1 },
    )

    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      observer.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [design, size, rpm, flipDirection, isTransitioning])

  return (
    <div className={`relative w-full h-full flex justify-center items-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full mx-auto shadow-2xl rounded-full cursor-pointer" // Added cursor-pointer
        aria-hidden="true"
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
        onClick={onClick} // Add onClick handler to the canvas
        title={onClick ? "Click to change record" : undefined} // Add title for accessibility
      />
    </div>
  )
})

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout | null

  return function debouncedFunction(...args: Parameters<F>): void {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)
  }
}

export { VinylRecord }
