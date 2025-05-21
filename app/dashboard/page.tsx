"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { VinylProvider } from "@/contexts/vinyl-context"
import { MusicTabs } from "@/components/music-tabs"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { ListContainer } from "@/components/list-container"
import { ContentLoading } from "@/components/content-loading"
import { RoastMe } from "@/components/roast-me"
import { VinylCollection } from "@/components/vinyl-collection"
import { ScrollToTop } from "@/components/scroll-to-top"
import { PurpleHeaderBar } from "@/components/purple-header-bar"
import { useSpotifyData } from "@/hooks/use-spotify-data"

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("top-tracks")
  const [timeRange, setTimeRange] = useState("short_term")

  // Fetch Spotify data
  const {
    topTracks,
    topArtists,
    recentlyPlayed,
    isLoading,
    error,
    refetch: refetchSpotifyData,
  } = useSpotifyData(timeRange)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
  }

  // Show loading state while authentication is in progress
  if (authLoading) {
    return <ContentLoading />
  }

  return (
    <VinylProvider>
      <div className="min-h-screen bg-black text-white">
        <PurpleHeaderBar />

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            <span className="text-purple-gradient">Your Music Dashboard</span>
          </h1>

          <VinylCollection />

          <div className="mt-8">
            <RoastMe
              topTracks={topTracks}
              topArtists={topArtists}
              recentlyPlayed={recentlyPlayed}
              activeTab={activeTab}
            />
          </div>

          <div className="mt-8">
            <MusicTabs activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="mt-4">
              {activeTab !== "recently-played" && (
                <TimeRangeSelector activeRange={timeRange} onRangeChange={handleTimeRangeChange} />
              )}
            </div>

            <div className="mt-6">
              {isLoading ? (
                <ContentLoading />
              ) : error ? (
                <div className="text-red-500 text-center p-4">
                  Error loading data. Please try again later.
                  <button
                    onClick={() => refetchSpotifyData()}
                    className="ml-2 text-purple-500 hover:text-purple-400 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <ListContainer
                  activeTab={activeTab}
                  topTracks={topTracks}
                  topArtists={topArtists}
                  recentlyPlayed={recentlyPlayed}
                />
              )}
            </div>
          </div>
        </main>

        <ScrollToTop />
      </div>
    </VinylProvider>
  )
}
