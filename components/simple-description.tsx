"use client"

import { useState, useEffect } from "react"

interface SimpleDescriptionProps {
  description: string
  className?: string
}

export function SimpleDescription({ description, className = "" }: SimpleDescriptionProps) {
  const [currentDescription, setCurrentDescription] = useState(description)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (description !== currentDescription) {
      setIsAnimating(true)
      
      // Quick fade out, then change text, then fade in
      setTimeout(() => {
        setCurrentDescription(description)
        setIsAnimating(false)
      }, 150)
    }
  }, [description, currentDescription])

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          bg-gradient-to-r from-purple-900/30 to-black/80 
          border border-purple-800/50 
          rounded-lg p-4 backdrop-blur-sm
          transition-opacity duration-150 ease-in-out
          ${isAnimating ? 'opacity-40' : 'opacity-100'}
        `}
      >
        <p className="text-sm text-[#A1A1AA] leading-relaxed">
          {currentDescription}
        </p>
      </div>
    </div>
  )
} 