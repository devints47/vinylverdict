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
  cursorChar = "|",
}: CursorTypewriterProps) {
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown) {
      setCursorPosition(0)
      setIsComplete(false)
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setCursorPosition(0)
    setIsComplete(false)

    const totalLength = markdown.length

    const animateText = () => {
      setCursorPosition((prev) => {
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

  // Create the text with the cursor inserted at the right position
  const getTextWithCursor = () => {
    if (isComplete) {
      return markdown
    }

    // Get the text before and after the cursor
    const beforeCursor = markdown.substring(0, cursorPosition)
    const afterCursor = markdown.substring(cursorPosition + 1)

    // If we're at the end, just return the text with cursor at the end
    if (cursorPosition >= markdown.length) {
      return beforeCursor + cursorChar
    }

    // Get the character at the cursor position
    const cursorPositionChar = markdown.charAt(cursorPosition)

    // Replace the character at cursor position with the cursor
    return beforeCursor + cursorChar + afterCursor
  }

  return (
    <div className={className}>
      <ReactMarkdown
        className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
        rehypePlugins={[rehypeRaw]}
      >
        {getTextWithCursor()}
      </ReactMarkdown>
    </div>
  )
}
