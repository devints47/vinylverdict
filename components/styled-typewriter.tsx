"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface StyledTypewriterProps {
  markdown: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function StyledTypewriter({ markdown, speed = 20, className = "", onComplete }: StyledTypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [processedContent, setProcessedContent] = useState<{ text: string; html: string }>({ text: "", html: "" })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hiddenRef = useRef<HTMLDivElement>(null)

  // Process the markdown content once when it changes
  useEffect(() => {
    if (!markdown) {
      setProcessedContent({ text: "", html: "" })
      return
    }

    // Create a temporary div to render the markdown
    const tempDiv = document.createElement("div")
    tempDiv.style.position = "absolute"
    tempDiv.style.left = "-9999px"
    tempDiv.style.top = "-9999px"
    document.body.appendChild(tempDiv)

    // Render the markdown to HTML
    const renderMarkdown = async () => {
      // Use ReactDOM to render the markdown component to the temp div
      const ReactDOM = (await import("react-dom/client")).default
      const root = ReactDOM.createRoot(tempDiv)

      root.render(
        <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose prose-invert">
          {markdown}
        </ReactMarkdown>,
      )

      // Wait a moment for rendering to complete
      setTimeout(() => {
        // Get the rendered HTML
        const html = tempDiv.innerHTML

        // Get the text content (this strips all HTML/markdown)
        const text = tempDiv.textContent || ""

        // Store both for later use
        setProcessedContent({ text, html })

        // Clean up
        root.unmount()
        document.body.removeChild(tempDiv)
      }, 100)
    }

    renderMarkdown()
  }, [markdown])

  // Reset animation when processed content changes
  useEffect(() => {
    setDisplayText("")
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!processedContent.text) return

    // Start with empty text
    let currentLength = 0

    // Function to incrementally reveal text
    const revealNextChar = () => {
      if (currentLength < processedContent.text.length) {
        currentLength++
        setDisplayText(processedContent.text.substring(0, currentLength))
        timeoutRef.current = setTimeout(revealNextChar, speed)
      } else {
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }

    // Start the animation
    timeoutRef.current = setTimeout(revealNextChar, speed)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [processedContent, speed, onComplete])

  return (
    <>
      {/* Hidden div with fully rendered markdown for reference */}
      <div ref={hiddenRef} className="hidden">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose prose-invert">
          {markdown}
        </ReactMarkdown>
      </div>

      {/* Visible div with typewriter effect */}
      <div className={className}>
        <div
          className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
          dangerouslySetInnerHTML={{
            __html: processedContent.html.replace(/<[^>]*>([^<]*)<\/[^>]*>/g, (match, content) => {
              const visibleLength = displayText.length
              const fullLength = processedContent.text.length

              // If we've revealed all text, show the full HTML
              if (visibleLength >= fullLength) return match

              // Calculate how much of this element's content should be visible
              const visibleContent = content.substring(
                0,
                Math.max(0, Math.min(content.length, visibleLength - processedContent.text.indexOf(content))),
              )

              if (visibleContent.length === 0) return ""

              // Replace the content with the visible portion
              return match.replace(content, visibleContent)
            }),
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
    </>
  )
}
