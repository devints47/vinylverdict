"use client"

import { useState, useEffect } from "react"
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
  selectedVinyl?: any
}

export function RoastMe({ topTracks, topArtists, recentlyPlayed, activeTab, selectedVinyl }: RoastMeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [roast, setRoast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const [isFallback, setIsFallback] = useState(false)
  const [mainContent, setMainContent] = useState<string>("")
  const [disclaimerText, setDisclaimerText] = useState<string>("")

  // Determine the assistant type based on the selected vinyl
  const assistantType = selectedVinyl?.assistantType || "snob"

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
      setRoast(null)
      setMainContent("")
      setDisclaimerText("")
      setTypewriterComplete(false)
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

      // Check if this is a fallback response
      if (response.includes("*Note:") || response.includes("Note: This is a fallback")) {
        setIsFallback(true)
      }

      setRoast(response)
    } catch (err) {
      console.error("Error getting roast:", err)
      setError(`Failed to analyze your music taste. Our AI critic is taking a break. Please try again later.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Extract the main roast content when roast changes
  useEffect(() => {
    if (!roast) return

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
      const index = roast.indexOf(pattern)
      if (index !== -1 && (disclaimerIndex === -1 || index < disclaimerIndex)) {
        disclaimerIndex = index
      }
    }

    if (disclaimerIndex !== -1) {
      setMainContent(roast.substring(0, disclaimerIndex).trim())
      setDisclaimerText(roast.substring(disclaimerIndex).trim())
    } else {
      setMainContent(roast)
      setDisclaimerText("")
    }
  }, [roast])

  // Get loading text based on assistant type
  const getLoadingText = () => {
    return assistantType === "worshipper"
      ? "The Taste Validator Is Appreciating..."
      : "The Music Snob Is Judging You..."
  }

  // Get emoji based on assistant type
  const getEmoji = () => {
    return assistantType === "worshipper" ? "✨" : "🔥"
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

      {mainContent && (
        <Card className="mt-6 card-holographic bg-gradient-to-r from-zinc-900 to-black max-w-3xl w-full">
          <CardContent className="pt-6 pb-2">
            <div className="markdown-content">
              {!typewriterComplete ? (
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
      )}
    </div>
  )
}
