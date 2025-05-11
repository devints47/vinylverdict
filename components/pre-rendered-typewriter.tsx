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
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [renderedHTML, setRenderedHTML] = useState<{ [key: string]: string }>({})
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Pre-render the markdown to HTML for each character length
  useEffect(() => {
    if (!markdown) {
      setRenderedHTML({})
      return
    }

    // Create a temporary container
    const tempContainer = document.createElement("div")
    const ReactDOM = require("react-dom/client")
    const root = ReactDOM.createRoot(tempContainer)

    // Pre-render the full markdown
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
      // Get the rendered HTML
      const fullHTML = tempContainer.innerHTML
      setRenderedHTML({ full: fullHTML })

      // Clean up
      root.unmount()
    }, 100)
  }, [markdown])

  // Handle the typewriter effect
  useEffect(() => {
    if (!markdown || !renderedHTML.full) return

    setDisplayText("")
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    let currentIndex = 0
    const plainText = markdown
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, "$1")

    const animateText = () => {
      if (currentIndex < plainText.length) {
        setDisplayText(plainText.substring(0, currentIndex + 1))
        currentIndex++
        timeoutRef.current = setTimeout(animateText, speed)
      } else {
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }

    timeoutRef.current = setTimeout(animateText, speed)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [markdown, renderedHTML.full, speed, onComplete])

  return (
    <div className={className} ref={containerRef}>
      {isComplete ? (
        <div
          className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
          dangerouslySetInnerHTML={{ __html: renderedHTML.full }}
        />
      ) : (
        <>
          <div className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient">
            {displayText}
            <span
              className="inline-block w-2 h-4 bg-purple-500 animate-pulse"
              style={{
                verticalAlign: "middle",
                marginLeft: "1px",
              }}
              aria-hidden="true"
            />
          </div>
        </>
      )}
    </div>
  )
}
