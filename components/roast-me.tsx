"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
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
  requestId?: string // Add requestId to track requests
}

// Create a session storage key
const SESSION_STORAGE_KEY = "vinylVerdict_responses"

export function RoastMe({ topTracks, topArtists, recentlyPlayed, activeTab, selectedVinyl }: RoastMeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)

  // Store responses for each assistant type
  const [responseStore, setResponseStore] = useState<Record<string, ResponseStore>>({})

  // Track active requests by assistant type
  const activeRequestRef = useRef<Record<string, { id: string; cancel: () => void }>>({})

  // Keep track of the last active tab to prevent re-rendering on tab change
  const lastActiveTabRef = useRef(activeTab)

  // Current assistant type
  const assistantType = selectedVinyl?.assistantType || "snob"

  // Get current response from store based on assistant type
  const currentResponse = responseStore[assistantType] || { content: "", isComplete: false }

  // Reference to the typewriter component to maintain its state
  const typewriterRef = useRef<{ reset: () => void } | null>(null)

  // Load saved responses from session storage on initial render
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      try {
        const savedResponses = sessionStorage.getItem(SESSION_STORAGE_KEY)
        if (savedResponses) {
          setResponseStore(JSON.parse(savedResponses))
        }
      } catch (err) {
        console.error("Error loading saved responses:", err)
      }
    }
  }, [])

  // Save responses to session storage whenever they change
  useEffect(() => {
    // Only run in browser environment and if we have responses
    if (typeof window !== "undefined" && Object.keys(responseStore).length > 0) {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(responseStore))
      } catch (err) {
        console.error("Error saving responses:", err)
      }
    }
  }, [responseStore])

  // Clean up any active requests when component unmounts
  useEffect(() => {
    return () => {
      // Cancel all active requests
      Object.values(activeRequestRef.current).forEach((request) => {
        if (request && typeof request.cancel === "function") {
          request.cancel()
        }
      })
    }
  }, [])

  // Get the appropriate button text based on the active tab and assistant type
  const getButtonText = () => {
    // Use a consistent action verb format based on assistant type
    let actionVerb
    switch (assistantType) {
      case "worshipper":
        actionVerb = "Validate"
        break
      case "historian":
        actionVerb = "Analyze"
        break
      case "snob":
      default:
        actionVerb = "Roast"
    }

    // Check if there's an active request for this assistant type
    const isActiveRequest = activeRequestRef.current[assistantType] !== undefined

    // If there's an active request, show "Cancel" instead
    if (isActiveRequest && isLoading) {
      return `Cancel ${actionVerb}`
    }

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

  // Function to cancel an active request
  const cancelActiveRequest = (assistantType: string) => {
    const activeRequest = activeRequestRef.current[assistantType]
    if (activeRequest && typeof activeRequest.cancel === "function") {
      activeRequest.cancel()
      delete activeRequestRef.current[assistantType]
      return true
    }
    return false
  }

  const handleRoastMe = async () => {
    // Check if there's an active request for this assistant type
    if (activeRequestRef.current[assistantType]) {
      // Cancel the active request
      cancelActiveRequest(assistantType)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setIsFallback(false)

      // Generate a unique ID for this request
      const requestId = `request_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      // Create a cancel function
      let isCancelled = false
      const cancel = () => {
        isCancelled = true
      }

      // Store the request in the active requests ref
      activeRequestRef.current[assistantType] = { id: requestId, cancel }

      // Clear any existing response for this assistant type
      setResponseStore((prev) => {
        // Create a new object to ensure React detects the change
        const newStore = { ...prev }

        // If there's an existing response for this assistant type, mark it as complete
        // to prevent the typewriter from continuing
        if (newStore[assistantType]) {
          newStore[assistantType] = {
            ...newStore[assistantType],
            isComplete: true,
          }
        }

        return newStore
      })

      // Update the last active tab reference
      lastActiveTabRef.current = activeTab

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

      // If the request was cancelled while waiting for the response, don't update the state
      if (isCancelled) {
        console.log("Request was cancelled, not updating state")
        return
      }

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
        "This analysis examines",
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
          requestId,
        },
      }))
    } catch (err) {
      console.error("Error getting roast:", err)
      setError(`Failed to analyze your music taste. Our AI critic is taking a break. Please try again later.`)
    } finally {
      // Remove this request from active requests
      if (activeRequestRef.current[assistantType]) {
        delete activeRequestRef.current[assistantType]
      }
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
    // Use the same format for all assistant types, just change the content
    switch (assistantType) {
      case "worshipper":
        return "This validation is a celebration of your personal listening habits. It's all in good fun and meant to highlight the positive aspects of your music taste."
      case "historian":
        return "This analysis examines your music in its historical and cultural context. It's meant to be educational and thought-provoking, not judgmental."
      case "snob":
      default:
        return "This roast is a satirical critique of your personal listening habits. It's all in good fun and not intended to insult any artists or fans."
    }
  }

  // Get loading text based on assistant type
  const getLoadingText = () => {
    // Use a standardized format for loading text
    switch (assistantType) {
      case "worshipper":
        return "The Taste Validator Is Appreciating..."
      case "historian":
        return "The Historian Is Researching..."
      case "snob":
      default:
        return "The Music Snob Is Judging You..."
    }
  }

  // Get emoji based on assistant type
  const getEmoji = () => {
    // Use a standardized format for emojis
    switch (assistantType) {
      case "worshipper":
        return "✨"
      case "historian":
        return "📚"
      case "snob":
      default:
        return "🔥"
    }
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

  // Create a stable position for the roast section that doesn't move when tabs change
  const roastSectionStyle = {
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
  }

  // Memoize the typewriter component to prevent re-rendering when tabs change
  const typewriterComponent = React.useMemo(() => {
    if (!currentResponse.content) return null

    if (!currentResponse.isComplete) {
      return (
        <CursorTypewriter
          markdown={currentResponse.content}
          speed={12} // Slowed down from 7ms to 12ms
          onComplete={handleTypewriterComplete}
          cursorChar="█"
        />
      )
    }

    return (
      <ReactMarkdown
        className="prose prose-invert max-w-none text-zinc-300 prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient animate-fadeIn"
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {currentResponse.content}
      </ReactMarkdown>
    )
  }, [currentResponse.content, currentResponse.isComplete, currentResponse.requestId])

  return (
    <div className="mb-8 flex flex-col items-center w-full" style={roastSectionStyle}>
      <div className="flex justify-center w-full">
        <Button
          onClick={handleRoastMe}
          disabled={false} // Never disable the button so users can cancel
          className={`btn-gradient holographic-shimmer text-white font-bold py-4 px-8 text-lg rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all hover:shadow-xl max-w-md ${
            activeRequestRef.current[assistantType] ? "bg-red-600 hover:bg-red-700" : ""
          }`}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{activeRequestRef.current[assistantType] ? "Cancel" : getLoadingText()}</span>
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
            <div className="markdown-content text-sm sm:text-base md:text-lg">{typewriterComponent}</div>
          </CardContent>

          <CardFooter className="pt-4 pb-4 text-sm text-zinc-500 italic">{getFooterText()}</CardFooter>
        </Card>
      )}
    </div>
  )
}
