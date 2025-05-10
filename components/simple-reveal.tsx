"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"

interface SimpleRevealProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function SimpleReveal({ text, speed = 30, className = "", onComplete }: SimpleRevealProps) {
  const [visibleLength, setVisibleLength] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Reset when text changes
  useEffect(() => {
    setVisibleLength(0)
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [text])

  // Handle the typewriter effect
  useEffect(() => {
    if (!text || isComplete) return

    if (visibleLength < text.length) {
      timeoutRef.current = setTimeout(() => {
        setVisibleLength((prev) => prev + 1)
      }, speed)
    } else if (!isComplete) {
      setIsComplete(true)
      if (onComplete) onComplete()
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [text, visibleLength, speed, onComplete, isComplete])

  const visibleText = text.substring(0, visibleLength)

  return (
    <div className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-spotify-green prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-spotify-green">
      <ReactMarkdown>{visibleText}</ReactMarkdown>
    </div>
  )
}
