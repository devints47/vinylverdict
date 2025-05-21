"use client"

import { useEffect, useState } from "react"

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TypewriterText({ text, speed = 15, className = "", onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!text) {
      setDisplayedText("")
      setCurrentIndex(0)
      return
    }

    // Reset if text changes
    if (currentIndex === 0) {
      setDisplayedText("")
    }

    // If we haven't reached the end of the text
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete && currentIndex === text.length) {
      // Call onComplete when typing is finished
      onComplete()
    }
  }, [text, currentIndex, speed, onComplete])

  // Reset when text changes completely
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
  }, [text])

  return (
    <div className={`text-sm sm:text-base md:text-lg ${className}`}>
      {displayedText}
      {currentIndex < text?.length && <span className="inline-block w-2 h-4 bg-spotify-green ml-1 animate-pulse" />}
    </div>
  )
}
