"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Share2 } from "lucide-react"
import { MarkdownTypewriter } from "@/components/markdown-typewriter"
import { ShareModal } from "@/components/share-modal"
import type { VinylDesign } from "@/components/vinyl-collection"

interface RoastMeProps {
  topTracks: any
  topArtists: any
  recentlyPlayed: any
  activeTab: string
  selectedVinyl: VinylDesign | null
}

export function RoastMe({ topTracks, topArtists, recentlyPlayed, activeTab, selectedVinyl }: RoastMeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isRoastVisible, setIsRoastVisible] = useState(false)
  const [roastText, setRoastText] = useState("")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [runId, setRunId] = useState<string | null>(null)
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [assistantType, setAssistantType] = useState<string>("snob")

  // Update assistant type when selectedVinyl changes
  useEffect(() => {
    if (selectedVinyl) {
      console.log("Setting assistant type from selectedVinyl:", selectedVinyl.assistantType)
      setAssistantType(selectedVinyl.assistantType)
    }
  }, [selectedVinyl])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval)
      }
    }
  }, [statusCheckInterval])

  const getButtonText = () => {
    if (isLoading) {
      return "Analyzing..."
    }

    switch (assistantType) {
      case "worshipper":
        return "Validate My Taste"
      case "historian":
        return "Analyze My History"
      case "snob":
      default:
        return "Roast Me"
    }
  }

  const getActiveData = () => {
    switch (activeTab) {
      case "top-tracks":
        return {
          data: topTracks?.items?.slice(0, 10).map((track: any) => ({
            song: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
            popularity: track.popularity,
            album: track.album.name,
            releaseDate: track.album.release_date,
            genres: track.genres || [],
          })),
          viewType: "top tracks",
        }
      case "top-artists":
        return {
          data: topArtists?.items?.slice(0, 10).map((artist: any) => ({
            artist: artist.name,
            popularity: artist.popularity,
            genres: artist.genres || [],
            followers: artist.followers?.total,
          })),
          viewType: "top artists",
        }
      case "recently-played":
      default:
        return {
          data: recentlyPlayed?.items?.slice(0, 10).map((item: any) => ({
            song: item.track.name,
            artist: item.track.artists.map((a: any) => a.name).join(", "),
            popularity: item.track.popularity,
            album: item.track.album.name,
            playedAt: item.played_at,
            genres: item.track.genres || [],
          })),
          viewType: "recently played",
        }
    }
  }

  const handleRoastClick = async () => {
    try {
      setIsLoading(true)
      setIsRoastVisible(false)
      setRoastText("")

      const { data, viewType } = getActiveData()

      if (!data || data.length === 0) {
        toast({
          title: "No data available",
          description: "Please wait for your music data to load or try another tab.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Make the API call to start the roast
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          viewType,
          assistantType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Roast API error:", errorData)

        // If there's a fallback response, use it
        if (errorData.fallback) {
          setRoastText(errorData.fallback)
          setIsRoastVisible(true)
          setIsLoading(false)
          return
        }

        throw new Error(`API error: ${errorData.error || "Unknown error"}`)
      }

      const result = await response.json()
      console.log("Roast API response:", result)

      // Store the thread and run IDs
      setThreadId(result.threadId)
      setRunId(result.runId)

      // Set up an interval to check the status
      const interval = setInterval(async () => {
        await checkRoastStatus(result.threadId, result.runId)
      }, 1000)

      setStatusCheckInterval(interval)
    } catch (error) {
      console.error("Error getting roast:", error)
      toast({
        title: "Error",
        description: "Failed to analyze your music taste. Please try again later.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const checkRoastStatus = async (threadId: string, runId: string) => {
    try {
      const response = await fetch(`/api/roast/status?threadId=${threadId}&runId=${runId}`)

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("Status check result:", result)

      if (result.status === "completed") {
        // Clear the interval
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval)
          setStatusCheckInterval(null)
        }

        // Set the roast text
        setRoastText(result.content)
        setIsRoastVisible(true)
        setIsLoading(false)
      } else if (result.status === "failed" || result.status === "cancelled" || result.status === "expired") {
        // Clear the interval
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval)
          setStatusCheckInterval(null)
        }

        // Show error
        toast({
          title: "Analysis failed",
          description: result.error || "Failed to analyze your music taste. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
      // For 'in_progress' status, we continue polling
    } catch (error) {
      console.error("Error checking roast status:", error)

      // Clear the interval
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval)
        setStatusCheckInterval(null)
      }

      toast({
        title: "Error",
        description: "Failed to check analysis status. Please try again later.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleShareClick = () => {
    setIsShareModalOpen(true)
  }

  const handleShareModalClose = () => {
    setIsShareModalOpen(false)
  }

  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}`)
    // Implement sharing logic here
  }

  return (
    <div className="w-full">
      {!isRoastVisible ? (
        <Button
          onClick={handleRoastClick}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {getButtonText()}
        </Button>
      ) : (
        <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 p-4 shadow-lg">
          <div className="prose prose-invert max-w-none">
            <MarkdownTypewriter content={roastText} speed={10} />
          </div>
          <div className="mt-4 flex justify-between">
            <Button
              onClick={() => setIsRoastVisible(false)}
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Close
            </Button>
            <Button onClick={handleShareClick} className="bg-purple-600 hover:bg-purple-700">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleShareModalClose}
        text={roastText}
        assistantType={assistantType}
        onShare={handleShare}
      />
    </div>
  )
}
