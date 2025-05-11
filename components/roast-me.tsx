"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import { formatTrackData, formatArtistData, formatRecentlyPlayedData } from "@/lib/format-utils"
import { getRoast } from "@/lib/openai-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AssistantResponse } from "./assistant-response"

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
  const [isFallback, setIsFallback] = useState(false)

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

      {/* Use the unified AssistantResponse component for all assistant types */}
      {roast && <AssistantResponse content={roast} isLoading={isLoading} className="mt-6 max-w-3xl" />}
    </div>
  )
}
