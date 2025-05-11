"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface CursorTypewriterProps {
  markdown: string
  speed?: number
  className?: string
  onComplete?: () => void
  cursorChar?: string
}

export function CursorTypewriter({
  markdown,
  speed = 20,
  className = "",
  onComplete,
  cursorChar = "█",
}: CursorTypewriterProps) {
  const [displayPosition, setDisplayPosition] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle cursor blinking
  useEffect(() => {
    // Start cursor blinking
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530) // Blink rate similar to terminals

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current)
      }
    }
  }, [])

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown) {
      setDisplayPosition(0)
      setIsComplete(false)
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setDisplayPosition(0)
    setIsComplete(false)
    setShowCursor(true) // Ensure cursor is visible at start

    const totalLength = markdown.length

    const animateText = () => {
      setDisplayPosition((prev) => {
        if (prev < totalLength) {
          timeoutRef.current = setTimeout(animateText, speed)
          return prev + 1
        } else {
          setIsComplete(true)
          if (onComplete) onComplete()
          return prev
        }
      })
    }

    timeoutRef.current = setTimeout(animateText, speed)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [markdown, speed, onComplete])

  // Create the text with only the typed characters visible plus cursor
  const getTextWithCursor = () => {
    if (isComplete) {
      return markdown
    }

    // Get only the text that has been "typed" so far
    const visibleText = markdown.substring(0, displayPosition)

    // Add the cursor at the end of the visible text if it should be shown
    return visibleText + (showCursor ? `<span class="terminal-cursor">${cursorChar}</span>` : "")
  }

  return (
    <div className={className}>
      <style jsx global>{`
        .terminal-cursor {
          color: #a855f7; /* Tailwind purple-500 */
          animation: blink 1.06s step-end infinite;
          display: inline-block;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <ReactMarkdown
        className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
        rehypePlugins={[rehypeRaw]}
      >
        {getTextWithCursor()}
      </ReactMarkdown>
    </div>
  )
}
