"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"

interface RevealTypewriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function RevealTypewriter({ text, speed = 30, className = "", onComplete }: RevealTypewriterProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Reset when text changes
  useEffect(() => {
    setProgress(0)
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [text])

  // Handle the typewriter effect
  useEffect(() => {
    if (!text || isComplete) return

    const incrementProgress = () => {
      setProgress((prev) => {
        const next = prev + 1
        if (next >= 100) {
          setIsComplete(true)
          if (onComplete) onComplete()
          return 100
        }
        return next
      })
    }

    timeoutRef.current = setTimeout(incrementProgress, speed)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [text, progress, speed, onComplete, isComplete])

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Pre-rendered markdown that will be revealed */}
      <div className="relative overflow-hidden">
        <ReactMarkdown className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-spotify-green prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-spotify-green">
          {text}
        </ReactMarkdown>

        {/* Overlay that hides the text and gradually reveals it */}
        {!isComplete && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-900"
            style={{
              clipPath: `inset(0 ${100 - progress}% 0 0)`,
              transition: "clip-path 50ms linear",
            }}
          />
        )}
      </div>

      {/* Cursor */}
      {!isComplete && (
        <span
          className="inline-block w-2 h-4 bg-spotify-green animate-pulse absolute"
          style={{
            left: `${progress}%`,
            top: 0,
          }}
        />
      )}
    </div>
  )
}
