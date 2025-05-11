"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface PreRenderedTypewriterProps {
  markdown: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function PreRenderedTypewriter({
  markdown,
  speed = 20,
  className = "",
  onComplete,
}: PreRenderedTypewriterProps) {
  const [displayedChars, setDisplayedChars] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [renderedHTML, setRenderedHTML] = useState("")
  const [plainText, setPlainText] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Pre-render the markdown to HTML
  useEffect(() => {
    if (!markdown) {
      setRenderedHTML("")
      setPlainText("")
      return
    }

    // Create a temporary container
    const tempContainer = document.createElement("div")

    // Use ReactDOM to render the markdown
    const ReactDOM = require("react-dom/client")
    const root = ReactDOM.createRoot(tempContainer)

    // Render the markdown
    root.render(
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
      >
        {markdown}
      </ReactMarkdown>,
    )

    // Wait for rendering to complete
    setTimeout(() => {
      // Get the rendered HTML and plain text
      setRenderedHTML(tempContainer.innerHTML)
      setPlainText(tempContainer.textContent || "")

      // Clean up
      root.unmount()
    }, 100)
  }, [markdown])

  // Handle the typewriter effect
  useEffect(() => {
    if (!plainText) return

    setDisplayedChars(0)
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const animateText = () => {
      setDisplayedChars((prev) => {
        if (prev < plainText.length) {
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
  }, [plainText, speed, onComplete])

  return (
    <div className={className} ref={containerRef}>
      <div
        className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
        dangerouslySetInnerHTML={{ __html: renderedHTML }}
        style={{
          WebkitMaskImage: `linear-gradient(to right, black ${(displayedChars / plainText.length) * 100}%, transparent ${(displayedChars / plainText.length) * 100}%)`,
          maskImage: `linear-gradient(to right, black ${(displayedChars / plainText.length) * 100}%, transparent ${(displayedChars / plainText.length) * 100}%)`,
        }}
      />
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
