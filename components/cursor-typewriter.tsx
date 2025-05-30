"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
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
  const [containerHeight, setContainerHeight] = useState<number | null>(null)
  
  const animationFrameRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const isMountedRef = useRef(true)

  // Set up the mounted ref
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Pre-calculate final content height to prevent layout shifts
  const finalContentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (markdown && !containerHeight) {
      // Create a hidden element to measure final content height
      const measureElement = document.createElement('div')
      measureElement.style.position = 'absolute'
      measureElement.style.visibility = 'hidden'
      measureElement.style.width = '100%'
      measureElement.style.pointerEvents = 'none'
      measureElement.innerHTML = `<div class="prose prose-invert max-w-none text-zinc-300">${markdown}</div>`
      
      document.body.appendChild(measureElement)
      const height = measureElement.offsetHeight
      setContainerHeight(height)
      document.body.removeChild(measureElement)
    }
  }, [markdown, containerHeight])

  // Memoize custom components to prevent re-creation
  const components = useMemo(() => ({
    h1: ({ ...props }: any) => {
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
  }), [cursorChar])

  // Optimized typewriter effect using requestAnimationFrame
  const animateTypewriter = useCallback((currentPosition: number) => {
    if (!isMountedRef.current || !markdown) return

    const now = performance.now()
    
    // Throttle updates based on speed setting
    if (now - lastUpdateTimeRef.current < speed) {
      animationFrameRef.current = requestAnimationFrame(() => animateTypewriter(currentPosition))
      return
    }

    lastUpdateTimeRef.current = now

    if (currentPosition >= markdown.length) {
      setCurrentText(markdown)
      setIsComplete(true)
      if (onComplete) onComplete()
      return
    }

    const newPosition = currentPosition + 1
    const newText = markdown.substring(0, newPosition)
    setCurrentText(newText + cursorChar)
    setDisplayPosition(newPosition)
    
    if (onProgress) onProgress(newPosition)
    
    animationFrameRef.current = requestAnimationFrame(() => animateTypewriter(newPosition))
  }, [markdown, speed, onComplete, onProgress, cursorChar])

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown) {
      setCurrentText("")
      setDisplayPosition(0)
      setIsComplete(false)
      return
    }

    setDisplayPosition(startPosition)
    const isAlreadyComplete = startPosition >= markdown.length
    setIsComplete(isAlreadyComplete)

    if (isAlreadyComplete) {
      setCurrentText(markdown)
          if (onComplete) onComplete()
      return
    }

    const initialText = markdown.substring(0, startPosition)
    setCurrentText(startPosition === 0 && !isAlreadyComplete ? cursorChar : initialText + cursorChar)

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    lastUpdateTimeRef.current = performance.now()
    animationFrameRef.current = requestAnimationFrame(() => animateTypewriter(startPosition))

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [markdown, startPosition, animateTypewriter, onComplete, cursorChar])

  return (
    <div
      className={`${className} text-sm sm:text-base md:text-lg transition-opacity duration-300 ${isComplete ? "opacity-100" : "opacity-95"}`}
      style={{ 
        minHeight: containerHeight ? `${containerHeight}px` : '100px',
        contain: 'layout style', // Improve rendering performance
        contentVisibility: 'auto' // Optimize rendering for off-screen content
      }}
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
