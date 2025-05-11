"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { formatTrackData, formatArtistData, formatRecentlyPlayedData } from "@/lib/format-utils"
import { getRoast } from "@/lib/openai-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SimpleReveal } from "./simple-reveal"

// Add the rehype-raw plugin to allow HTML in markdown
import rehypeRaw from "rehype-raw"

interface RoastMeProps {
  topTracks: any
  topArtists: any
  recentlyPlayed: any
  activeTab: string
}

export function RoastMe({ topTracks, topArtists, recentlyPlayed, activeTab }: RoastMeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [roast, setRoast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const [isFallback, setIsFallback] = useState(false)

  // Function to strip markdown characters from text
  const stripMarkdownChars = (text: string): string => {
    return text
      .replace(/#{1,6}\s/g, "") // Remove headings
      .replace(/\*\*/g, "") // Remove bold
      .replace(/\*/g, "") // Remove italic
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, "$1") // Replace links with just the text
      .replace(/`([^`]+)`/g, "$1") // Remove inline code
      .replace(/~~([^~]+)~~/g, "$1") // Remove strikethrough
      .replace(/>\s/g, "") // Remove blockquotes
      .replace(/\n\s*[-*+]\s/g, "\n• ") // Replace list markers with bullet points
      .replace(/\n\s*\d+\.\s/g, "\n• ") // Replace numbered lists with bullet points
  }

  const handleRoastMe = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setRoast(null)
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

      // Call the API through our service
      const response = await getRoast(formattedData, viewType)

      // Check if this is a fallback response
      if (response.includes("*Note: This is a fallback roast")) {
        setIsFallback(true)
      }

      setRoast(response)
    } catch (err) {
      console.error("Error getting roast:", err)
      setError("Failed to roast your music taste. Our AI critic is taking a break. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get the appropriate button text based on the active tab
  const getButtonText = () => {
    switch (activeTab) {
      case "top-tracks":
        return "Roast My Top Tracks"
      case "top-artists":
        return "Roast My Top Artists"
      case "recently-played":
        return "Roast My Recent Plays"
      default:
        return "Roast My Music Taste"
    }
  }

  // Extract the main roast content and fallback disclaimer if present
  const extractRoastContent = () => {
    if (!roast) return { mainContent: "", disclaimer: "" }

    // Check if there's a fallback disclaimer
    const fallbackIndex = roast.indexOf("*Note: This is a fallback roast")

    if (fallbackIndex !== -1) {
      return {
        mainContent: roast.substring(0, fallbackIndex).trim(),
        disclaimer:
          "Note: Our resident Music Snob is taking a coffee break. You're getting the intern's opinion instead.",
      }
    }

    return { mainContent: roast, disclaimer: "" }
  }

  const { mainContent, disclaimer } = extractRoastContent()

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
              <span>The Music Snob Is Judging You...</span>
            </>
          ) : (
            <>
              <span className="text-xl">🔥</span>
              <span>{getButtonText()}</span>
              <span className="text-xl">🔥</span>
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

      {roast && (
        <Card className="mt-6 card-holographic bg-gradient-to-r from-zinc-900 to-black max-w-3xl w-full">
          <CardContent className="pt-6">
            <div className="markdown-content">
              {!typewriterComplete ? (
                <SimpleReveal text={mainContent} speed={20} onComplete={() => setTypewriterComplete(true)} />
              ) : (
                <ReactMarkdown
                  className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-purple-gradient prose-strong:text-white prose-em:text-zinc-400 prose-li:marker:text-purple-gradient"
                  rehypePlugins={[rehypeRaw]} // Add rehypeRaw to process HTML in markdown
                >
                  {mainContent}
                </ReactMarkdown>
              )}
            </div>

            {disclaimer && <div className="mt-4 pt-4 border-t border-zinc-700 text-sm text-zinc-500">{disclaimer}</div>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
