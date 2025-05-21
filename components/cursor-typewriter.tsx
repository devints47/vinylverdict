"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface CursorTypewriterProps {
  markdown: string
  speed?: number
  onComplete?: () => void
  cursorChar?: string
}

export function CursorTypewriter({
  markdown,
  speed = 7, // Default to faster speed (7ms)
  onComplete,
  cursorChar = "|",
}: CursorTypewriterProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const animationRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Reset state when markdown changes
  useEffect(() => {
    setDisplayedContent("")
    setIsComplete(false)
    setCursorVisible(true)

    // Clear any existing animation or timeout
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    return () => {
      isMountedRef.current = false

      // Clean up animations and timeouts
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [markdown])

  // Typewriter effect
  useEffect(() => {
    if (!markdown || isComplete) return

    let currentIndex = 0
    let lastUpdateTime = 0

    const animate = (timestamp: number) => {
      if (!isMountedRef.current) return

      if (!lastUpdateTime) lastUpdateTime = timestamp

      const elapsed = timestamp - lastUpdateTime

      if (elapsed >= speed) {
        if (currentIndex < markdown.length) {
          setDisplayedContent(markdown.substring(0, currentIndex + 1))
          currentIndex++
          lastUpdateTime = timestamp
        } else {
          setIsComplete(true)
          if (onComplete) onComplete()
          return
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [markdown, speed, isComplete, onComplete])

  // Blinking cursor effect
  useEffect(() => {
    if (isComplete) return

    const cursorInterval = setInterval(() => {
      if (isMountedRef.current) {
        setCursorVisible((prev) => !prev)
      }
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [isComplete])

  // Custom components for ReactMarkdown
  const components = {
    // Add any custom components here if needed
  }

  return (
    <div className="typewriter-container">
      <ReactMarkdown
        className="prose prose-invert max-w-none text-zinc-300 prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {displayedContent}
      </ReactMarkdown>
      {!isComplete && cursorVisible && <span className="cursor-blink">{cursorChar}</span>}
    </div>
  )
}
