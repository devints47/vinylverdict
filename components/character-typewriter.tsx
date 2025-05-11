"use client"

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Process the markdown to strip formatting characters for counting
  const processMarkdown = (text: string) => {
    // Replace markdown formatting with HTML but keep the same character count
    return text
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*([^*]+)\*/g, "<em>$1</em>") // Italic
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, "<a href='$2'>$1</a>") // Links
      .replace(/#{1,6}\s+(.+)/g, "<h3>$1</h3>") // Headers (simplified)
      .replace(/`([^`]+)`/g, "<code>$1</code>") // Code
      .replace(/\n\n/g, "<br/><br/>") // Line breaks
  }

  const processedMarkdown = processMarkdown(markdown || "")

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown) {
      setCurrentIndex(0)
      setIsComplete(false)
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setCurrentIndex(0)
    setIsComplete(false)

    const animateText = () => {
      setCurrentIndex((prev) => {
        if (prev < processedMarkdown.length) {
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
  }, [markdown, speed, onComplete, processedMarkdown.length])

  // Display the current text
  const displayText = processedMarkdown.substring(0, currentIndex)

  return (
    <div className={className}>
      {isComplete ? (
        <ReactMarkdown
          className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
          rehypePlugins={[rehypeRaw]}
        >
          {markdown}
        </ReactMarkdown>
      ) : (
        <div
          className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
          dangerouslySetInnerHTML={{ __html: displayText }}
        />
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
  )
}
