"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { formatTrackData, formatArtistData, formatRecentlyPlayedData } from "@/lib/format-utils"
import { getRoast } from "@/lib/openai-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CursorTypewriter } from "./cursor-typewriter"

// Add the rehype-raw plugin to allow HTML in markdown
import rehypeRaw from "rehype-raw"

interface RoastMeProps {
  topTracks: any
  topArtists: any
  recentlyPlayed: any
  activeTab: string
  selectedVinyl?: any // Add selected vinyl prop
}

// Interface for storing responses by assistant type
interface ResponseStore {
  content: string
  isComplete: boolean
}

export function RoastMe({ topTracks, topArtists, recentlyPlayed, activeTab, selectedVinyl }: RoastMeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)

  // Store responses for each assistant type
  const [responseStore, setResponseStore] = useState<Record<string, ResponseStore>>({})

  // Current assistant type
  const assistantType = selectedVinyl?.assistantType || "snob"

  // Get current response from store based on assistant type
  const currentResponse = responseStore[assistantType] || { content: "", isComplete: false }

  // Get the appropriate button text based on the active tab and assistant type
  const getButtonText = () => {
    // Use a consistent action verb format based on assistant type
    const actionVerb = assistantType === "worshipper" ? "Validate" : "Roast"

    // Use a consistent format for all tabs
    switch (activeTab) {
      case "top-tracks":
        return `${actionVerb} My Top Tracks`
      case "top-artists":
        return `${actionVerb} My Top Artists`
      case "recently-played":
        return `${actionVerb} My Recent Plays`
      default:
        return `${actionVerb} My Music Taste`
    }
  }

  const handleRoastMe = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setIsFallback(false)

      // Determine which data to use based on the active tab
      let formattedData
      let viewType

      switch (activeTab) {
        case "top-tracks":
          formattedData = formatTrackData(topTracks?.items)
          viewType = "top tracks"
          break
        case "top-artists":
          formattedData = formatArtistData(topArtists?.items)
          viewType = "top artists"
          break
        case "recently-played":
          formattedData = formatRecentlyPlayedData(recentlyPlayed)
          viewType = "recently played"
          break
        default:
          formattedData = formatTrackData(topTracks?.items)
          viewType = "top tracks"
      }

      // Call the API through our service with the assistant type
      const response = await getRoast(formattedData, viewType, assistantType)

      // Check if this is a fallback response using a standardized pattern
      if (response.includes("*Note:") || response.includes("Note: This is a fallback")) {
        setIsFallback(true)
      }

      // Process the response to extract main content
      let mainContent = response

      // Use a standardized set of disclaimer patterns for all assistant types
      const disclaimerPatterns = [
        "*Note:",
        "Note: ",
        "This roast is a satirical critique",
        "This validation is a celebration",
        "This analysis is",
      ]

      let disclaimerIndex = -1

      for (const pattern of disclaimerPatterns) {
        const index = response.indexOf(pattern)
        if (index !== -1 && (disclaimerIndex === -1 || index < disclaimerIndex)) {
          disclaimerIndex = index
        }
      }

      if (disclaimerIndex !== -1) {
        mainContent = response.substring(0, disclaimerIndex).trim()
      }

      // Store the response for this assistant type
      setResponseStore((prev) => ({
        ...prev,
        [assistantType]: {
          content: mainContent,
          isComplete: false,
        },
      }))
    } catch (err) {
      console.error("Error getting roast:", err)
      setError(`Failed to analyze your music taste. Our AI critic is taking a break. Please try again later.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle typewriter completion
  const handleTypewriterComplete = () => {
    setResponseStore((prev) => ({
      ...prev,
      [assistantType]: {
        ...prev[assistantType],
        isComplete: true,
      },
    }))
  }

  // Get the appropriate footer text based on the assistant type
  const getFooterText = () => {
    // Use the same format for both assistant types, just change the content
    return assistantType === "worshipper"
      ? "This validation is a celebration of your personal listening habits. It's all in good fun and meant to highlight the positive aspects of your music taste."
      : "This roast is a satirical critique of your personal listening habits. It's all in good fun and not intended to insult any artists or fans."
  }

  // Get loading text based on assistant type
  const getLoadingText = () => {
    // Use a standardized format for loading text
    return assistantType === "worshipper"
      ? "The Taste Validator Is Appreciating..."
      : "The Music Snob Is Judging You..."
  }

  // Get emoji based on assistant type
  const getEmoji = () => {
    // Use a standardized format for emojis
    return assistantType === "worshipper" ? "✨" : "🔥"
  }

  // Custom components for ReactMarkdown to preserve emoji colors
  const components = {
    h1: ({ node, ...props }) => {
      // Process children to wrap text (but not emojis) in styled spans
      const children = React.Children.toArray(props.children).map((child) => {
        if (typeof child === "string") {
          // Use regex to find emojis
          return child.split(/(\p{Emoji}+)/gu).map((part, i) => {
            // Check if this part is an emoji
            if (/\p{Emoji}/u.test(part)) {
              return (
                <span key={i} className="emoji">
                  {part}
                </span>
              )
            }
            // Regular text gets the gradient
            return (
              <span key={i} className="text-purple-gradient">
                {part}
              </span>
            )
          })
        }
        return child
      })

      return <h1 {...props}>{children}</h1>
    },
    h2: ({ node, ...props }) => {
      // Process children to wrap text (but not emojis) in styled spans
      const children = React.Children.toArray(props.children).map((child) => {
        if (typeof child === "string") {
          // Use regex to find emojis
          return child.split(/(\p{Emoji}+)/gu).map((part, i) => {
            // Check if this part is an emoji
            if (/\p{Emoji}/u.test(part)) {
              return (
                <span key={i} className="emoji">
                  {part}
                </span>
              )
            }
            // Regular text gets the gradient
            return (
              <span key={i} className="text-purple-gradient">
                {part}
              </span>
            )
          })
        }
        return child
      })

      return <h2 {...props}>{children}</h2>
    },
    h3: ({ node, ...props }) => {
      // Process children to wrap text (but not emojis) in styled spans
      const children = React.Children.toArray(props.children).map((child) => {
        if (typeof child === "string") {
          // Use regex to find emojis
          return child.split(/(\p{Emoji}+)/gu).map((part, i) => {
            // Check if this part is an emoji
            if (/\p{Emoji}/u.test(part)) {
              return (
                <span key={i} className="emoji">
                  {part}
                </span>
              )
            }
            // Regular text gets the gradient
            return (
              <span key={i} className="text-purple-gradient">
                {part}
              </span>
            )
          })
        }
        return child
      })

      return <h3 {...props}>{children}</h3>
    },
  }

  return (
    <div className="mb-8 flex flex-col items-center sticky top-0 z-10 w-full">
      <div className="flex justify-center w-full">
        <Button
          onClick={handleRoastMe}
          disabled={isLoading}
          className="btn-gradient holographic-shimmer text-white font-bold py-4 px-8 text-lg rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all hover:shadow-xl max-w-md"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{getLoadingText()}</span>
            </>
          ) : (
            <>
              <span className="text-xl">{getEmoji()}</span>
              <span>{getButtonText()}</span>
              <span className="text-xl">{getEmoji()}</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4 max-w-3xl w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentResponse.content && (
        <Card className="mt-6 card-holographic bg-gradient-to-r from-zinc-900 to-black max-w-3xl w-full">
          <CardContent className="pt-6 pb-2">
            <div className="markdown-content">
              {!currentResponse.isComplete ? (
                <CursorTypewriter
                  markdown={currentResponse.content}
                  speed={20}
                  onComplete={handleTypewriterComplete}
                  cursorChar="█"
                />
              ) : (
                <ReactMarkdown
                  className="prose prose-invert max-w-none text-zinc-300 prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
                  rehypePlugins={[rehypeRaw]}
                  components={components}
                >
                  {currentResponse.content}
                </ReactMarkdown>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-4 pb-4 text-sm text-zinc-500 italic">{getFooterText()}</CardFooter>
        </Card>
      )}
    </div>
  )
}
