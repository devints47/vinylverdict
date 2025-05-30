"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import React from "react"

interface CursorTypewriterProps {
  markdown: string
  speed?: number
  className?: string
  onComplete?: () => void
  onProgress?: (position: number) => void
  startPosition?: number
  cursorChar?: string
}

export function CursorTypewriter({
  markdown,
  speed = 12.5,
  className = "",
  onComplete,
  onProgress,
  startPosition = 0,
  cursorChar = "█",
}: CursorTypewriterProps) {
  const [displayPosition, setDisplayPosition] = useState(startPosition)
  const [isComplete, setIsComplete] = useState(false)
  const [currentText, setCurrentText] = useState<string>("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Set up the mounted ref
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Custom components for ReactMarkdown that match the final styling
  const components = {
    h1: ({ ...props }: any) => {
      // Process children to wrap text (but not emojis) in styled spans
      const children = React.Children.toArray(props.children).map((child, index) => {
        if (typeof child === "string") {
          // Use regex to find emojis, cursor, and numbers
          return child.split(/(\p{Emoji}+|█|\d+)/gu).map((part, i) => {
            // Check if this part is the cursor character
            if (part === cursorChar) {
              return (
                <span key={`${index}-cursor-${i}`} className="cursor-char" style={{ color: '#a855f7' }}>
                  {part}
                </span>
              )
            }
            // Check if this part is a number
            else if (/^\d+$/.test(part)) {
              return (
                <span key={`${index}-number-${i}`} style={{ color: '#a855f7' }}>
                  {part}
                </span>
              )
            }
            // Check if this part is an emoji
            else if (/\p{Emoji}/u.test(part)) {
              return (
                <span key={`${index}-emoji-${i}`} className="emoji">
                  {part}
                </span>
              )
            }
            // Regular text gets the gradient styling
            return (
              <span key={`${index}-text-${i}`} className="gradient-text">
                {part}
              </span>
            )
          })
        }
        return child
      })

      return <h1 {...props}>{children}</h1>
    },
    h2: ({ ...props }: any) => {
      const children = React.Children.toArray(props.children).map((child, index) => {
        if (typeof child === "string") {
          return child.split(/(\p{Emoji}+|█|\d+)/gu).map((part, i) => {
            if (part === cursorChar) {
              return (
                <span key={`${index}-cursor-${i}`} className="cursor-char" style={{ color: '#a855f7' }}>
                  {part}
                </span>
              )
            }
            else if (/^\d+$/.test(part)) {
              return (
                <span key={`${index}-number-${i}`} style={{ color: '#a855f7' }}>
                  {part}
                </span>
              )
            }
            else if (/\p{Emoji}/u.test(part)) {
              return (
                <span key={`${index}-emoji-${i}`} className="emoji">
                  {part}
                </span>
              )
            }
            return (
              <span key={`${index}-text-${i}`} className="gradient-text">
                {part}
              </span>
            )
          })
        }
        return child
      })

      return <h2 {...props}>{children}</h2>
    },
    h3: ({ ...props }: any) => {
      const children = React.Children.toArray(props.children).map((child, index) => {
        if (typeof child === "string") {
          return child.split(/(\p{Emoji}+|█|\d+)/gu).map((part, i) => {
            if (part === cursorChar) {
              return (
                <span key={`${index}-cursor-${i}`} className="cursor-char" style={{ color: '#a855f7' }}>
                  {part}
                </span>
              )
            }
            else if (/^\d+$/.test(part)) {
              return (
                <span key={`${index}-number-${i}`} style={{ color: '#a855f7' }}>
                  {part}
                </span>
              )
            }
            else if (/\p{Emoji}/u.test(part)) {
              return (
                <span key={`${index}-emoji-${i}`} className="emoji">
                  {part}
                </span>
              )
            }
            return (
              <span key={`${index}-text-${i}`} className="gradient-text">
                {part}
              </span>
            )
          })
        }
        return child
      })

      return <h3 {...props}>{children}</h3>
    },
    // Handle cursor and numbers in regular paragraphs too
    p: ({ ...props }: any) => {
      const children = React.Children.toArray(props.children).map((child, index) => {
        if (typeof child === "string") {
          return child.split(/(\p{Emoji}+|█|\d+)/gu).map((part, i) => {
            if (part === cursorChar) {
              return (
                <span key={`${index}-cursor-${i}`} className="cursor-char" style={{ color: '#a855f7' }}>
                  {part}
                </span>
              )
            }
            else if (/^\d+$/.test(part)) {
              return (
                <span key={`${index}-number-${i}`} style={{ color: '#a855f7' }}>
                  {part}
                </span>
              )
            }
            else if (/\p{Emoji}/u.test(part)) {
              return (
                <span key={`${index}-emoji-${i}`} className="emoji">
                  {part}
                </span>
              )
            }
            return part
          })
        }
        return child
      })

      return <p {...props}>{children}</p>
    }
  }

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown) {
      setCurrentText("")
      setDisplayPosition(0)
      setIsComplete(false)
      return
    }

    // Initialize from startPosition
    setDisplayPosition(startPosition)
    const isAlreadyComplete = startPosition >= markdown.length
    setIsComplete(isAlreadyComplete)

    if (isAlreadyComplete) {
      setCurrentText(markdown)
      if (onComplete) onComplete()
      return
    }

    // Set initial text based on startPosition - include cursor if not complete
    const initialText = markdown.substring(0, startPosition)
    setCurrentText(startPosition === 0 && !isAlreadyComplete ? cursorChar : initialText + cursorChar)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    let currentPosition = startPosition

    const typeNextCharacter = () => {
      if (!isMountedRef.current) return

      if (currentPosition >= markdown.length) {
        setCurrentText(markdown) // Final text without cursor
          setIsComplete(true)
          if (onComplete) onComplete()
        return
      }

      currentPosition++
      const newText = markdown.substring(0, currentPosition)
      // Add cursor to the end of the current text
      setCurrentText(newText + cursorChar)
      setDisplayPosition(currentPosition)
      
      // Report progress to parent
      if (onProgress) onProgress(currentPosition)
      
      timeoutRef.current = setTimeout(typeNextCharacter, speed)
    }

    // Start typing after a small delay
    timeoutRef.current = setTimeout(typeNextCharacter, speed)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [markdown, speed, onComplete, onProgress, startPosition, cursorChar])

  return (
    <div
      className={`${className} text-sm sm:text-base md:text-lg transition-opacity duration-300 ${isComplete ? "opacity-100" : "opacity-95"}`}
      style={{ minHeight: isComplete ? 'auto' : '100px' }}
    >
      {/* Global styles for consistent emoji and gradient rendering */}
      <style jsx global>{`
        .emoji {
          background: none !important;
          -webkit-background-clip: initial !important;
          -webkit-text-fill-color: initial !important;
          background-clip: initial !important;
          color: initial !important;
        }
        .gradient-text {
          background: linear-gradient(135deg, #9333ea, #a855f7, #c026d3, #a855f7, #9333ea) !important;
          background-size: 200% 200% !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        .cursor-char {
          color: #a855f7 !important;
          background: none !important;
          -webkit-text-fill-color: #a855f7 !important;
        }
      `}</style>
      
      <div className="prose prose-invert max-w-none text-zinc-300 prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
          components={components}
      >
          {currentText}
      </ReactMarkdown>
      </div>
    </div>
  )
}
