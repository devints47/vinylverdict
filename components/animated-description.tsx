"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

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
  // Track if we've had a description change after initial render
  const [hasChanged, setHasChanged] = useState(false)
  const [initialDescription] = useState(description)
  const [currentDescription, setCurrentDescription] = useState(description)

  // Get the appropriate gradient class based on label color
  const gradientClass = colorMap[labelColor] || colorMap.purple

  useEffect(() => {
    // Skip if this is the initial description
    if (description === initialDescription) {
      return
    }

    // Mark that we've had a change and update the description
    setHasChanged(true)
    setCurrentDescription(description)
  }, [description, initialDescription])

  // If we haven't had a description change yet, render a static version
  if (!hasChanged) {
    return (
      <div className={className}>
        <div className={`bg-gradient-to-r ${gradientClass} border border-zinc-800 rounded-lg p-3 backdrop-blur-sm`}>
          <p className="text-sm text-[#A1A1AA]">{currentDescription}</p>
        </div>
      </div>
    )
  }

  // After we've had at least one change, use the animated version
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDescription}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-r ${gradientClass} border border-zinc-800 rounded-lg p-3 backdrop-blur-sm`}
        >
          <p className="text-sm text-[#A1A1AA]">{currentDescription}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
