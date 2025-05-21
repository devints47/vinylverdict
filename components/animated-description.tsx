"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedDescriptionProps {
  description: string
  labelColor?: string
}

export function AnimatedDescription({ description, labelColor = "purple" }: AnimatedDescriptionProps) {
  const [currentDescription, setCurrentDescription] = useState(description)
  const [isAnimating, setIsAnimating] = useState(false)

  // Update description when it changes
  useEffect(() => {
    if (description !== currentDescription) {
      setIsAnimating(true)

      // Short delay before changing the text
      const timer = setTimeout(() => {
        setCurrentDescription(description)

        // Short delay before ending the animation
        setTimeout(() => {
          setIsAnimating(false)
        }, 300)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [description, currentDescription])

  // Get gradient class based on label color
  const getGradientClass = () => {
    switch (labelColor) {
      case "teal":
        return "from-teal-400 to-emerald-500"
      case "blue":
        return "from-blue-400 to-indigo-500"
      case "pink":
        return "from-pink-400 to-purple-500"
      case "red":
        return "from-yellow-500 to-red-600"
      case "purple":
      default:
        return "from-purple-400 to-indigo-500"
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentDescription}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-4 shadow-lg h-full`}
      >
        <p className={`text-sm md:text-base text-gradient bg-gradient-to-r ${getGradientClass()}`}>
          {currentDescription}
        </p>
      </motion.div>
    </AnimatePresence>
  )
}
