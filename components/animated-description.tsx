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
  const [currentDescription, setCurrentDescription] = useState(description)
  const [key, setKey] = useState(0)

  // Update the description with animation when it changes
  useEffect(() => {
    if (description !== currentDescription) {
      setKey((prev) => prev + 1)
      setCurrentDescription(description)
    }
  }, [description, currentDescription])

  // Get the appropriate gradient class based on label color
  const gradientClass = colorMap[labelColor] || colorMap.purple

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
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
