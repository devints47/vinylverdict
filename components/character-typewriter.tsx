"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface CharacterTypewriterProps {
  markdown: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function CharacterTypewriter({ markdown, speed = 20, className = "", onComplete }: CharacterTypewriterProps) {
  const [displayedChars, setDisplayedChars] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const fullContentRef = useRef<HTMLDivElement>(null)

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown) {
      setDisplayedChars(0)
      setIsComplete(false)
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setDisplayedChars(0)
    setIsComplete(false)

    const totalLength = markdown.length

    const animateText = () => {
      setDisplayedChars((prev) => {
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

  // Render the full markdown in a hidden div for reference
  const hiddenStyle: React.CSSProperties = {
    position: "absolute",
    visibility: "hidden",
    height: 0,
    width: 0,
    overflow: "hidden",
    pointerEvents: "none",
  }

  return (
    <>
      {/* Hidden div with full rendered markdown */}
      <div ref={fullContentRef} style={hiddenStyle}>
        <ReactMarkdown
          className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
          rehypePlugins={[rehypeRaw]}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      {/* Visible content */}
      <div className={className}>
        {isComplete ? (
          <ReactMarkdown
            className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
            rehypePlugins={[rehypeRaw]}
          >
            {markdown}
          </ReactMarkdown>
        ) : (
          <ReactMarkdown
            className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
            rehypePlugins={[rehypeRaw]}
          >
            {markdown.substring(0, displayedChars)}
          </ReactMarkdown>
        )}
        {!isComplete && (
          <span
            className="inline-block w-2 h-4 bg-purple-500 animate-pulse"
            style={{
              verticalAlign: "middle",
              marginLeft: "1px",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  )
}
