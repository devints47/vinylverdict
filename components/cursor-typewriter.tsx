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
  speed = 12.5, // Doubled speed again: 12.5ms per character (~80 characters per second)
  className = "",
  onComplete,
  onProgress,
  startPosition = 0,
  cursorChar = "█",
}: CursorTypewriterProps) {
  const [displayPosition, setDisplayPosition] = useState(startPosition)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Set up the mounted ref
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown) {
      setDisplayPosition(0)
      setIsComplete(false)
      return
    }

    // Initialize from startPosition
    setDisplayPosition(startPosition)
    const isAlreadyComplete = startPosition >= markdown.length
    setIsComplete(isAlreadyComplete)

    if (isAlreadyComplete) {
      if (onComplete) onComplete()
      return
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    let currentPosition = startPosition

    const typeNextCharacter = () => {
      if (!isMountedRef.current) return

      if (currentPosition >= markdown.length) {
        setIsComplete(true)
        if (onComplete) onComplete()
        return
      }

      currentPosition++
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
  }, [markdown, speed, onComplete, onProgress, startPosition])  // Added startPosition dependency

  // Create the visible text with cursor replacement
  const getVisibleTextWithCursor = () => {
    if (!markdown) return cursorChar
    
    if (isComplete) {
      return markdown
    }
    
    // Get the text up to current position and add cursor at the end
    const visibleText = markdown.substring(0, displayPosition)
    return visibleText + cursorChar
  }

  return (
    <div
      className={`${className} text-sm sm:text-base md:text-lg transition-opacity duration-300 ${isComplete ? "opacity-100" : "opacity-95"}`}
    >
      <style jsx global>{`
        .terminal-cursor {
          color: #a855f7; /* Purple cursor */
          display: inline-block;
          /* Removed blinking animation */
        }
        .markdown-content {
          color: #d4d4d8;
          max-width: none;
        }
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          background: linear-gradient(135deg, #9333ea, #a855f7, #c026d3, #a855f7, #9333ea);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .markdown-content strong {
          color: white;
        }
        .markdown-content em {
          color: #a1a1aa;
        }
        .markdown-content li::marker {
          background: linear-gradient(135deg, #9333ea, #a855f7, #c026d3, #a855f7, #9333ea);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        /* Style the cursor character to be purple */
        .cursor-char {
          color: #a855f7 !important;
          background: none !important;
          -webkit-text-fill-color: #a855f7 !important;
        }
      `}</style>
      <div className="markdown-content">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            // Custom component to handle cursor styling in text nodes
            p: ({ children, ...props }) => {
              // Convert children to string and find cursor character
              const childString = React.Children.toArray(children).join('')
              if (!isComplete && childString.includes(cursorChar)) {
                // Split text around cursor and style the cursor
                const parts = childString.split(cursorChar)
                return (
                  <p {...props}>
                    {parts[0]}
                    <span className="cursor-char">{cursorChar}</span>
                    {parts[1]}
                  </p>
                )
              }
              return <p {...props}>{children}</p>
            },
            // Handle other elements that might contain the cursor
            h1: ({ children, ...props }) => {
              const childString = React.Children.toArray(children).join('')
              if (!isComplete && childString.includes(cursorChar)) {
                const parts = childString.split(cursorChar)
                return (
                  <h1 {...props}>
                    {parts[0]}
                    <span className="cursor-char">{cursorChar}</span>
                    {parts[1]}
                  </h1>
                )
              }
              return <h1 {...props}>{children}</h1>
            },
            h2: ({ children, ...props }) => {
              const childString = React.Children.toArray(children).join('')
              if (!isComplete && childString.includes(cursorChar)) {
                const parts = childString.split(cursorChar)
                return (
                  <h2 {...props}>
                    {parts[0]}
                    <span className="cursor-char">{cursorChar}</span>
                    {parts[1]}
                  </h2>
                )
              }
              return <h2 {...props}>{children}</h2>
            },
            h3: ({ children, ...props }) => {
              const childString = React.Children.toArray(children).join('')
              if (!isComplete && childString.includes(cursorChar)) {
                const parts = childString.split(cursorChar)
                return (
                  <h3 {...props}>
                    {parts[0]}
                    <span className="cursor-char">{cursorChar}</span>
                    {parts[1]}
                  </h3>
                )
              }
              return <h3 {...props}>{children}</h3>
            },
            li: ({ children, ...props }) => {
              const childString = React.Children.toArray(children).join('')
              if (!isComplete && childString.includes(cursorChar)) {
                const parts = childString.split(cursorChar)
                return (
                  <li {...props}>
                    {parts[0]}
                    <span className="cursor-char">{cursorChar}</span>
                    {parts[1]}
                  </li>
                )
              }
              return <li {...props}>{children}</li>
            },
          }}
        >
          {getVisibleTextWithCursor()}
        </ReactMarkdown>
      </div>
    </div>
  )
}
