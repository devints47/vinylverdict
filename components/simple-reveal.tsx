"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"

interface SimpleRevealProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function SimpleReveal({ text, speed = 20, className = "", onComplete }: SimpleRevealProps) {
  const [visibleText, setVisibleText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Reset when text changes
  useEffect(() => {
    setVisibleText("")
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Start with empty text
    let currentLength = 0

    // Function to incrementally reveal text
    const revealNextChar = () => {
      if (currentLength < text.length) {
        currentLength++
        setVisibleText(text.substring(0, currentLength))
        timeoutRef.current = setTimeout(revealNextChar, speed)
      } else {
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }

    // Start the animation
    if (text) {
      timeoutRef.current = setTimeout(revealNextChar, speed)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [text, speed, onComplete])

  return (
    <div className={className} ref={containerRef}>
      <div className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient">
        <ReactMarkdown>{visibleText}</ReactMarkdown>
        {!isComplete && (
          <span
            className="inline-block w-2 h-4 bg-purple-500 animate-pulse"
            style={{
              verticalAlign: "middle",
              marginLeft: "1px",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
}
