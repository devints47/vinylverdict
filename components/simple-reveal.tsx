"use client"

import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface SimpleRevealProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function SimpleReveal({ text, speed = 20, className = "", onComplete }: SimpleRevealProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Pre-render the full markdown to HTML
  const [renderedHTML, setRenderedHTML] = useState<string[]>([])
  const [displayedHTML, setDisplayedHTML] = useState<string[]>([])

  // Process the markdown into HTML chunks on text change
  useEffect(() => {
    if (!text) return

    // Create a temporary div to render the markdown
    const tempDiv = document.createElement("div")
    const markdownElement = document.createElement("div")
    tempDiv.appendChild(markdownElement)

    // Use ReactMarkdown to render the full text
    const ReactDOMServer = require("react-dom/server")
    const fullHTML = ReactDOMServer.renderToString(<ReactMarkdown rehypePlugins={[rehypeRaw]}>{text}</ReactMarkdown>)

    // Set the HTML content
    markdownElement.innerHTML = fullHTML

    // Split the HTML into characters/tags for animation
    const htmlChunks = splitHTMLIntoChunks(markdownElement.innerHTML)
    setRenderedHTML(htmlChunks)
    setDisplayedHTML([])
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  // Function to split HTML into chunks that preserve tags
  const splitHTMLIntoChunks = (html: string): string[] => {
    const chunks: string[] = []
    let inTag = false
    let currentChunk = ""

    for (let i = 0; i < html.length; i++) {
      const char = html[i]

      if (char === "<") {
        // If we're starting a tag and have accumulated text, push it
        if (currentChunk) {
          chunks.push(currentChunk)
          currentChunk = ""
        }
        inTag = true
        currentChunk += char
      } else if (char === ">" && inTag) {
        // Complete the tag
        currentChunk += char
        chunks.push(currentChunk)
        currentChunk = ""
        inTag = false
      } else if (inTag) {
        // Inside a tag, keep accumulating
        currentChunk += char
      } else {
        // Regular character, push individually
        chunks.push(char)
      }
    }

    // Add any remaining chunk
    if (currentChunk) {
      chunks.push(currentChunk)
    }

    return chunks
  }

  // Animate the HTML chunks
  useEffect(() => {
    if (!renderedHTML.length) return

    if (currentIndex < renderedHTML.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedHTML((prev) => [...prev, renderedHTML[currentIndex]])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    } else if (currentIndex === renderedHTML.length && !isComplete) {
      setIsComplete(true)
      if (onComplete) onComplete()
    }
  }, [renderedHTML, currentIndex, speed, onComplete, isComplete])

  // Reset when text changes completely
  useEffect(() => {
    setDisplayedHTML([])
    setCurrentIndex(0)
    setIsComplete(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [text])

  return (
    <div className={className}>
      <div
        className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
        dangerouslySetInnerHTML={{ __html: displayedHTML.join("") }}
      />
      {currentIndex < renderedHTML.length && <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse" />}
    </div>
  )
}
