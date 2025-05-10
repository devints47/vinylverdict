"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"

interface MarkdownTypewriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function MarkdownTypewriter({ text, speed = 30, className = "", onComplete }: MarkdownTypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!text) {
      setDisplayedText("")
      setCurrentIndex(0)
      setIsComplete(false)
      return
    }

    // Reset if text changes
    if (currentIndex === 0) {
      setDisplayedText("")
      setIsComplete(false)
    }

    // If we haven't reached the end of the text
    if (currentIndex < text.length) {
      timeoutRef.current = setTimeout(() => {
        // Add the next character
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    } else if (currentIndex === text.length && !isComplete) {
      // Call onComplete when typing is finished
      setIsComplete(true)
      if (onComplete) onComplete()
    }
  }, [text, currentIndex, speed, onComplete, isComplete])

  // Reset when text changes completely
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [text])

  return (
    <div className={className}>
      <ReactMarkdown className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-spotify-green prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-spotify-green">
        {displayedText}
      </ReactMarkdown>
      {currentIndex < text?.length && <span className="inline-block w-2 h-4 bg-spotify-green ml-1 animate-pulse" />}
    </div>
  )
}
