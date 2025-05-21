"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

interface AnimatedDescriptionProps {
  description: string
  labelColor: string
  className?: string
}

// Map label colors to tailwind gradient classes
const colorMap: Record<string, string> = {
  purple: "from-purple-900/30 to-black/80 border-purple-800/50",
  teal: "from-teal-900/30 to-black/80 border-teal-800/50",
  blue: "from-blue-900/30 to-black/80 border-blue-800/50",
  pink: "from-pink-900/30 to-black/80 border-pink-800/50",
  red: "from-red-900/30 to-black/80 border-red-800/50",
}

export function AnimatedDescription({ description, labelColor, className = "" }: AnimatedDescriptionProps) {
  const [currentDescription, setCurrentDescription] = useState(description)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const firstUpdate = useRef(true)

  // Get the appropriate gradient class based on label color
  const gradientClass = colorMap[labelColor] || colorMap.purple

  // Update the description when it changes
  useEffect(() => {
    // Skip animation on first render/mount
    if (firstUpdate.current) {
      firstUpdate.current = false
      setCurrentDescription(description)
      return
    }

    // Only animate after the first description change
    if (description !== currentDescription) {
      setShouldAnimate(true)
      setCurrentDescription(description)
    }
  }, [description, currentDescription])

  // For the first render, return a static div with no animation
  if (!shouldAnimate) {
    return (
      <div className={`relative ${className}`}>
        <div className={`bg-gradient-to-r ${gradientClass} border border-zinc-800 rounded-lg p-3 backdrop-blur-sm`}>
          <p className="text-sm text-[#A1A1AA]">{currentDescription}</p>
        </div>
      </div>
    )
  }

  // For subsequent renders, use motion for animation
  return (
    <div className={`relative ${className}`}>
      <motion.div
        key={currentDescription}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-r ${gradientClass} border border-zinc-800 rounded-lg p-3 backdrop-blur-sm`}
      >
        <p className="text-sm text-[#A1A1AA]">{currentDescription}</p>
      </motion.div>
    </div>
  )
}
