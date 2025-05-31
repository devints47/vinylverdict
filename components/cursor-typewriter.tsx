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

// Mobile detection hook - more stable version
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
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
  const [currentHeight, setCurrentHeight] = useState<number>(0) // Track current height as typewriter progresses
  
  const animationFrameRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const isMountedRef = useRef(true)
  const contentRef = useRef<HTMLDivElement>(null) // Ref to measure content height
  const lastHeightMeasureRef = useRef<number>(0) // Track last height measurement time
  
  // Mobile detection
  const isMobile = useIsMobile()
  
  // Stable speed calculation - memoize it to prevent changes during tab switching
  const stableSpeed = useMemo(() => {
    // Calculate the final speed once and keep it stable
    const finalSpeed = isMobile ? speed * 2 : speed // Slower on mobile (higher number = slower)
    return finalSpeed
  }, [speed, isMobile]) // Only recalculate if the actual speed prop or initial mobile state changes
  
  const heightMeasureInterval = isMobile ? 100 : 10 // Less frequent height measurements on mobile

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

  // Handle page visibility changes to maintain consistent timing when tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && animationFrameRef.current) {
        // Reset the timer when the page becomes visible again to prevent speed issues
        lastUpdateTimeRef.current = performance.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
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

  // Function to measure current content height
  const measureCurrentHeight = useCallback(() => {
    const now = performance.now()
    
    // Throttle height measurements on mobile for better performance
    if (isMobile && now - lastHeightMeasureRef.current < heightMeasureInterval) {
      return
    }
    
    if (contentRef.current) {
      // Use requestAnimationFrame for smoother height updates
      requestAnimationFrame(() => {
        if (contentRef.current && isMountedRef.current) {
          const height = contentRef.current.scrollHeight
          setCurrentHeight(height)
          lastHeightMeasureRef.current = now
        }
      })
    }
  }, [isMobile, heightMeasureInterval])

  // Update height when content changes
  useEffect(() => {
    if (currentText) {
      // Use a longer delay on mobile to reduce DOM thrashing
      const delay = isMobile ? 50 : 10
      const timeoutId = setTimeout(measureCurrentHeight, delay)
      return () => clearTimeout(timeoutId)
    } else {
      setCurrentHeight(0)
    }
  }, [currentText, measureCurrentHeight, isMobile])

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
    if (now - lastUpdateTimeRef.current < stableSpeed) {
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
  }, [markdown, stableSpeed, onComplete, onProgress, cursorChar])

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
      className={`${className} text-sm sm:text-base md:text-lg transition-all duration-300 ease-out ${isComplete ? "opacity-100" : "opacity-95"}`}
      style={{ 
        height: currentHeight > 0 ? `${currentHeight}px` : 'auto',
        minHeight: currentHeight > 0 ? `${currentHeight}px` : '20px',
        overflow: 'hidden',
        contain: 'layout style', // Improve rendering performance
        contentVisibility: 'auto', // Optimize rendering for off-screen content
        // Mobile-specific optimizations
        ...(isMobile && {
          willChange: 'height', // Hint to browser for optimization
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden', // Reduce rendering overhead
        })
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
        ${isMobile ? `
          /* Mobile-specific optimizations */
          .prose * {
            will-change: auto !important;
          }
        ` : ''}
      `}</style>
      
      <div 
        ref={contentRef}
        className="prose prose-invert max-w-none text-zinc-300 prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
        style={{
          // Mobile-specific optimizations
          ...(isMobile && {
            contain: 'layout style',
            transform: 'translateZ(0)',
          })
        }}
      >
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
