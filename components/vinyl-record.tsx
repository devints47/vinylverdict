"use client"

import { useEffect, useRef } from "react"

// Define the vinyl design type
export interface VinylDesign {
  id: string
  name: string
  labelColor: string
  faceType: "snob" | "happy" | "cool" | "surprised"
  labelText: string
}

interface VinylRecordProps {
  design?: VinylDesign
  size?: number
  className?: string
}

// Default design if none provided
const DEFAULT_DESIGN: VinylDesign = {
  id: "snob-classic",
  name: "The Critic",
  labelColor: "purple",
  faceType: "snob",
  labelText: "SNOBSCORE • PREMIUM VINYL • AUDIOPHILE EDITION •",
}

export function VinylRecord({ design = DEFAULT_DESIGN, size, className = "" }: VinylRecordProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
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

    // Create gradient colors for the label based on design
    let gradientColors: string[] = []

    switch (design.labelColor) {
      case "teal":
        gradientColors = ["#14b8a6", "#0d9488", "#5eead4", "#2dd4bf", "#0f766e", "#14b8a6"]
        break
      case "pink":
        gradientColors = ["#ec4899", "#db2777", "#fbcfe8", "#f472b6", "#be185d", "#ec4899"]
        break
      case "red":
        gradientColors = ["#ef4444", "#dc2626", "#fca5a5", "#f87171", "#b91c1c", "#ef4444"]
        break
      case "blue":
        gradientColors = ["#3b82f6", "#2563eb", "#93c5fd", "#60a5fa", "#1d4ed8", "#3b82f6"]
        break
      case "purple":
      default:
        gradientColors = ["#A855F7", "#9333EA", "#C084FC", "#8B5CF6", "#D946EF", "#A855F7"]
        break
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
      gradientColors.forEach((color, index) => {
        const position = (index / (gradientColors.length - 1) + offset) % 1
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
    const drawReflection = (rotation: number) => {
      // Create a shine effect that moves with rotation
      const gradient = ctx.createLinearGradient(
        centerX - outerRadius,
        centerY - outerRadius,
        centerX + outerRadius,
        centerY + outerRadius,
      )

      // Adjust the gradient position based on rotation
      const offset = (Math.sin(rotation * 2) + 1) / 2

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

    // Draw outer black vinyl
    const drawVinyl = (rotation = 0, gradientOffset = 0) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasSize, canvasSize)

      // Rotate canvas for the vinyl
      ctx.save()
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
      for (let i = outerRadius - 10; i > outerRadius / 3; i -= 3) {
        const opacity = 0.05 + Math.random() * 0.1
        ctx.beginPath()
        ctx.arc(centerX, centerY, i, 0, 2 * Math.PI)
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Add some random scratches for authenticity
      for (let i = 0; i < 5; i++) {
        const startAngle = Math.random() * Math.PI * 2
        const arcLength = (Math.random() * Math.PI) / 4
        const radius = outerRadius / 3 + Math.random() * (outerRadius - outerRadius / 3 - 10)

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + arcLength)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Draw reflection that moves with rotation
      drawReflection(rotation)

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

      // Draw the stationary tonearm (not affected by vinyl rotation)
      drawTonearm()
    }

    // Start rotation and gradient animation
    let rotation = 0
    let gradientOffset = 0
    const animate = () => {
      rotation += 0.003 // Consistent rotation speed
      gradientOffset += 0.002 // Consistent color cycling

      drawVinyl(rotation, gradientOffset)
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    // Handle resize
    const handleResize = () => {
      const newWidth = canvas.parentElement?.clientWidth || 300
      canvas.width = newWidth
      canvas.height = newWidth
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [design, size])

  return (
    <div className={`relative flex justify-center items-center ${className}`}>
      <canvas ref={canvasRef} className="w-full h-auto mx-auto shadow-2xl rounded-full" aria-hidden="true" />
    </div>
  )
}
