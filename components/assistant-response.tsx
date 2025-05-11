"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { CursorTypewriter } from "./cursor-typewriter"

interface AssistantResponseProps {
  content: string | null
  isLoading: boolean
  className?: string
}

export function AssistantResponse({ content, isLoading, className = "" }: AssistantResponseProps) {
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const [mainContent, setMainContent] = useState<string>("")
  const [disclaimerText, setDisclaimerText] = useState<string>("")

  // Extract the main content and disclaimer when content changes
  useEffect(() => {
    if (!content) {
      setMainContent("")
      setDisclaimerText("")
      return
    }

    // Find the disclaimer section - look for standard patterns
    const disclaimerPatterns = [
      "This roast is a satirical critique",
      "This validation is a celebration",
      "*Note:",
      "The Music Snob",
      "Humbly at your service",
    ]

    let disclaimerIndex = -1

    for (const pattern of disclaimerPatterns) {
      const index = content.indexOf(pattern)
      if (index !== -1 && (disclaimerIndex === -1 || index < disclaimerIndex)) {
        disclaimerIndex = index
      }
    }

    if (disclaimerIndex !== -1) {
      setMainContent(content.substring(0, disclaimerIndex).trim())
      setDisclaimerText(content.substring(disclaimerIndex).trim())
    } else {
      setMainContent(content)
      setDisclaimerText("")
    }
  }, [content])

  if (!content && !isLoading) {
    return null
  }

  return (
    <Card className={`card-holographic bg-gradient-to-r from-zinc-900 to-black w-full ${className}`}>
      <CardContent className="pt-6 pb-2">
        <div className="markdown-content">
          {!typewriterComplete && content ? (
            <CursorTypewriter
              markdown={mainContent}
              speed={20}
              onComplete={() => setTypewriterComplete(true)}
              cursorChar="█"
            />
          ) : (
            <ReactMarkdown
              className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
              rehypePlugins={[rehypeRaw]}
            >
              {mainContent}
            </ReactMarkdown>
          )}
        </div>
      </CardContent>

      {disclaimerText && (
        <CardFooter className="pt-4 pb-4 text-sm text-zinc-500 italic">
          <ReactMarkdown
            className="prose prose-invert max-w-none text-zinc-500 text-sm italic"
            rehypePlugins={[rehypeRaw]}
          >
            {disclaimerText}
          </ReactMarkdown>
        </CardFooter>
      )}
    </Card>
  )
}
