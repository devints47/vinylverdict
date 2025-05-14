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

// Regex to detect emojis
const emojiRegex = /(\p{Emoji}+)/gu

export function CursorTypewriter({
  markdown,
  speed = 20,
  className = "",
  onComplete,
  cursorChar = "|",
}: CursorTypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Process the markdown to wrap emojis in spans
  const processMarkdown = (text: string) => {
    // For headings, we need to process them specially
    const processedLines = text.split("\n").map((line) => {
      // Check if this is a heading line (starts with # symbols)
      if (/^#{1,6}\s/.test(line)) {
        // Split the line into heading marker and content
        const [marker, ...rest] = line.split(/(?<=^#{1,6})\s/)
        const content = rest.join(" ")

        // Process the content to wrap emojis
        const processedContent = content
          .split(emojiRegex)
          .map((part, i) => {
            if (emojiRegex.test(part)) {
              return `<span class="emoji">${part}</span>`
            }
            return `<span class="heading-text">${part}</span>`
          })
          .join("")

        // Reconstruct the line
        return `${marker} ${processedContent}`
      }

      return line
    })

    return processedLines.join("\n")
  }

  // Effect to handle the typewriter animation
  useEffect(() => {
    if (!markdown) return

    setDisplayText("")
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    let currentLength = 0
    const processedMarkdown = processMarkdown(markdown)

    const revealNextChar = () => {
      if (currentLength < processedMarkdown.length) {
        currentLength++
        setDisplayText(processedMarkdown.substring(0, currentLength))
        timeoutRef.current = setTimeout(revealNextChar, speed)
      } else {
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }

    timeoutRef.current = setTimeout(revealNextChar, speed)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [markdown, speed, onComplete])

  // Effect to process DOM after rendering to ensure emojis display correctly
  useEffect(() => {
    if (!containerRef.current) return

    // Find all heading elements
    const headings = containerRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")

    // Process each heading to ensure emojis display correctly
    headings.forEach((heading) => {
      // Skip if already processed
      if (heading.getAttribute("data-processed") === "true") return

      // Mark as processed
      heading.setAttribute("data-processed", "true")

      // Ensure emoji spans have the correct styling
      const emojiSpans = heading.querySelectorAll(".emoji")
      emojiSpans.forEach((span) => {
        if (span instanceof HTMLElement) {
          span.style.webkitBackgroundClip = "initial"
          span.style.webkitTextFillColor = "initial"
          span.style.backgroundClip = "initial"
          span.style.color = "initial"
        }
      })
    })
  }, [displayText])

  return (
    <div ref={containerRef} className={className}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose prose-invert max-w-none">
        {displayText}
      </ReactMarkdown>
      {!isComplete && (
        <span
          className="inline-block w-2 h-4 bg-purple-500 animate-pulse"
          style={{
            verticalAlign: "middle",
            marginLeft: "1px",
          }}
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      )}
    </div>
  )
}
