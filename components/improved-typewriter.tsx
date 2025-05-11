"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface ImprovedTypewriterProps {
  markdown: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function ImprovedTypewriter({ markdown, speed = 20, className = "", onComplete }: ImprovedTypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown) {
      setDisplayText("")
      setCursorPosition(0)
      setIsComplete(false)
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setDisplayText("")
    setCursorPosition(0)
    setIsComplete(false)

    const totalLength = markdown.length

    const animateText = () => {
      setCursorPosition((prev) => {
        if (prev < totalLength) {
          // Update the displayed text to include everything up to the cursor
          setDisplayText(markdown.substring(0, prev))

          timeoutRef.current = setTimeout(animateText, speed)
          return prev + 1
        } else {
          setDisplayText(markdown)
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

  // Custom components for ReactMarkdown
  const components = {
    // Add a blinking cursor after the last character
    p: ({ children, ...props }: any) => {
      return (
        <p {...props}>
          {children}
          {!isComplete && (
            <span
              className="inline-block w-[0.1em] h-[1.2em] bg-purple-500 animate-pulse ml-[1px] align-middle"
              aria-hidden="true"
            />
          )}
        </p>
      )
    },
  }

  return (
    <div className={className}>
      <ReactMarkdown
        className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {displayText}
      </ReactMarkdown>
    </div>
  )
}
