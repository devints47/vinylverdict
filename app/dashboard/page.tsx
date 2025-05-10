"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader2, RefreshCw, Users } from "lucide-react"
import { MusicTabs } from "@/components/music-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { TrackItem } from "@/components/track-item"
import { ArtistItem } from "@/components/artist-item"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { RoastMe } from "@/components/roast-me"
import { TechGridBackground } from "@/components/tech-grid-background"
import { AudioWave } from "@/components/audio-wave"
import type { TimeRange } from "@/lib/spotify-api"
import { formatDate, getArtists } from "@/lib/spotify-api"
import { ListContainer } from "@/components/list-container"
import dynamic from "next/dynamic"

// Dynamically import components that aren't needed immediately
const DynamicVinylCollection = dynamic(
  () => import("@/components/vinyl-collection-unified").then((mod) => mod.VinylCollectionUnified),
  {
    ssr: false,
    loading: () => <div className="w-full h-[300px] bg-zinc-900/50 rounded-lg animate-pulse"></div>,
  },
)

interface UserProfile {
  display_name: string
  images: Array<{ url: string }>
  followers: { total: number }
  country: string
  product: string
}

interface ArtistInfo {
  id: string
  name: string
  genres: string[]
  [key: string]: any
}

// Create a loading component
const DashboardLoading = () => (
  <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
    <TechGridBackground />
    <Navbar />
    <div className="flex-1 flex items-center justify-center relative z-10">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-bright-purple animate-spin mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Loading your profile</h1>
        <p className="text-zinc-400">Please wait while we fetch your data...</p>
      </div>
    </div>
    <Footer />
  </div>
)

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for Spotify data
  const [recentlyPlayed, setRecentlyPlayed] = useState<any>(null)
  const [artistInfo, setArtistInfo] = useState<Record<string, ArtistInfo>>({})
  const [topTracks, setTopTracks] = useState<Record<TimeRange, any>>({
    short_term: null,
    medium_term: null,
    long_term: null,
  })
  const [topArtists, setTopArtists] = useState<Record<TimeRange, any>>({
    short_term: null,
    medium_term: null,
    long_term: null,
  })
  const [activeTab, setActiveTab] = useState<string>("recently-played")
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term")
  const [isLoadingTracks, setIsLoadingTracks] = useState(false)
  const [isLoadingArtists, setIsLoadingArtists] = useState(false)
  const [isLoadingRecent, setIsLoadingRecent] = useState(false)
  const [lastFetched, setLastFetched] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Pagination state
  const [visibleRecentCount, setVisibleRecentCount] = useState(20)
  const [visibleTracksCount, setVisibleTracksCount] = useState(20)
  const [visibleArtistsCount, setVisibleArtistsCount] = useState(20)

  // Cache duration - 1 hour in milliseconds
  const CACHE_DURATION = 60 * 60 * 1000

  // Get current data based on selected tab and time range
  const currentTopTracks = topTracks[timeRange]
  const currentTopArtists = topArtists[timeRange]

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If not authenticated and not loading, redirect to login
        if (!isAuthenticated && !isLoading) {
          console.log("Not authenticated, redirecting to login")
          router.push("/login")
          return
        }
      } catch (err) {
        console.error("Error checking auth:", err)
        setError("Failed to check authentication status")
      }
    }

    checkAuth()
  }, [isAuthenticated, isLoading, router])

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true)

      // Use the server API endpoint
      const response = await fetch("/api/auth/me")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setProfile(data)
    } catch (err) {
      console.error("Error fetching profile:", err)
      throw new Error("Failed to load your profile")
    } finally {
      setIsLoadingProfile(false)
    }
  }, [])

  // Fetch recently played tracks and their artists' info
  const fetchRecentlyPlayed = useCallback(async () => {
    try {
      setIsLoadingRecent(true)
      // Use the server API endpoint to get recently played tracks
      const data = await fetch("/api/spotify/me/player/recently-played?limit=50").then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
        return res.json()
      })

      setRecentlyPlayed(data)

      // Extract unique artist IDs from the recently played tracks
      if (data && data.items && data.items.length > 0) {
        const artistIds = new Set<string>()
        data.items.forEach((item: any) => {
          item.track.artists.forEach((artist: any) => {
            artistIds.add(artist.id)
          })
        })

        // Fetch artist information if we have artist IDs
        if (artistIds.size > 0) {
          const artistsData = await getArtists(Array.from(artistIds))

          // Create a map of artist ID to artist info
          const artistInfoMap: Record<string, ArtistInfo> = {}
          if (artistsData && artistsData.artists) {
            artistsData.artists.forEach((artist: ArtistInfo) => {
              artistInfoMap[artist.id] = artist
            })
          }

          setArtistInfo(artistInfoMap)
        }
      }
    } catch (err) {
      console.error("Error fetching recently played:", err)
      throw new Error("Failed to load your recently played tracks")
    } finally {
      setIsLoadingRecent(false)
    }
  }, [])

  // Fetch top tracks for all time ranges
  const fetchAllTopTracks = useCallback(async () => {
    try {
      setIsLoadingTracks(true)

      const timeRanges: TimeRange[] = ["short_term", "medium_term", "long_term"]
      const promises = timeRanges.map((range) =>
        fetch(`/api/spotify/me/top/tracks?time_range=${range}&limit=50`).then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
          return res.json()
        }),
      )

      const results = await Promise.all(promises)

      const newTopTracks = {
        short_term: results[0],
        medium_term: results[1],
        long_term: results[2],
      }

      setTopTracks(newTopTracks)

      // Extract unique artist IDs from all top tracks
      const artistIds = new Set<string>()
      results.forEach((result) => {
        if (result && result.items) {
          result.items.forEach((track: any) => {
            track.artists.forEach((artist: any) => {
              artistIds.add(artist.id)
            })
          })
        }
      })

      // Fetch artist information if we have artist IDs
      if (artistIds.size > 0) {
        const artistsData = await getArtists(Array.from(artistIds))

        // Create a map of artist ID to artist info
        const artistInfoMap: Record<string, ArtistInfo> = {}
        if (artistsData && artistsData.artists) {
          artistsData.artists.forEach((artist: ArtistInfo) => {
            artistInfoMap[artist.id] = artist
          })
        }

        // Update the artist info state, preserving any existing entries
        setArtistInfo((prevState) => ({
          ...prevState,
          ...artistInfoMap,
        }))
      }
    } catch (err) {
      console.error("Error fetching top tracks:", err)
      throw new Error("Failed to load your top tracks")
    } finally {
      setIsLoadingTracks(false)
    }
  }, [])

  // Fetch top artists for all time ranges
  const fetchAllTopArtists = useCallback(async () => {
    try {
      setIsLoadingArtists(true)

      const timeRanges: TimeRange[] = ["short_term", "medium_term", "long_term"]
      const promises = timeRanges.map((range) =>
        fetch(`/api/spotify/me/top/artists?time_range=${range}&limit=50`).then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
          return res.json()
        }),
      )

      const results = await Promise.all(promises)

      const newTopArtists = {
        short_term: results[0],
        medium_term: results[1],
        long_term: results[2],
      }

      setTopArtists(newTopArtists)
    } catch (err) {
      console.error("Error fetching top artists:", err)
      throw new Error("Failed to load your top artists")
    } finally {
      setIsLoadingArtists(false)
    }
  }, [])

  // Fetch all data
  const fetchAllData = useCallback(
    async (force = false) => {
      try {
        // Check if cache is valid and we're not forcing a refresh
        const now = Date.now()
        if (!force && lastFetched > 0 && now - lastFetched < CACHE_DURATION) {
          console.log("Using cached data")
          return
        }

        setIsRefreshing(true)

        // Fetch all data in parallel
        await Promise.all([fetchProfile(), fetchRecentlyPlayed(), fetchAllTopTracks(), fetchAllTopArtists()])

        // Update last fetched timestamp
        setLastFetched(now)

        // Reset pagination counts when refreshing data
        setVisibleRecentCount(20)
        setVisibleTracksCount(20)
        setVisibleArtistsCount(20)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(
          "Failed to load your Spotify data. The Music Snob refuses to analyze such poor quality data. Please try again.",
        )
      } finally {
        setIsRefreshing(false)
      }
    },
    [fetchProfile, fetchRecentlyPlayed, fetchAllTopTracks, fetchAllTopArtists, lastFetched],
  )

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchAllData()
    }
  }, [isAuthenticated, isLoading, fetchAllData])

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  // Handle time range change
  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range)
    // Reset visible count when changing time range
    setVisibleTracksCount(20)
    setVisibleArtistsCount(20)
  }, [])

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    fetchAllData(true)
  }, [fetchAllData])

  // Load more handlers
  const loadMoreRecent = useCallback(() => {
    setVisibleRecentCount((prev) => Math.min(prev + 20, recentlyPlayed?.items?.length || 0))
  }, [recentlyPlayed?.items?.length])

  const loadMoreTracks = useCallback(() => {
    setVisibleTracksCount((prev) => Math.min(prev + 20, currentTopTracks?.items?.length || 0))
  }, [currentTopTracks?.items?.length])

  const loadMoreArtists = useCallback(() => {
    setVisibleArtistsCount((prev) => Math.min(prev + 20, currentTopArtists?.items?.length || 0))
  }, [currentTopArtists?.items?.length])

  // Get genres for a track based on its artists - memoized for performance
  const getTrackGenres = useCallback(
    (track: any): string[] => {
      if (!track || !track.artists) return []

      const genres = new Set<string>()
      track.artists.forEach((artist: any) => {
        const artistData = artistInfo[artist.id]
        if (artistData && artistData.genres) {
          artistData.genres.forEach((genre: string) => genres.add(genre))
        }
      })

      return Array.from(genres).slice(0, 3) // Limit to 3 genres
    },
    [artistInfo],
  )

  // Show loading state
  if (isLoading || isLoadingProfile) {
    return <DashboardLoading />
  }

  // Load More Button Component
  const LoadMoreButton = ({ onClick, isVisible }: { onClick: () => void; isVisible: boolean }) => {
    if (!isVisible) return null

    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={onClick}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-full text-sm transition-colors"
        >
          Load More
        </button>
      </div>
    )
  }

  // Content components for each tab
  const RecentlyPlayedContent = () => (
    <Card
      className="bg-gradient-to-r from-zinc-900 to-black border border-transparent"
      style={{
        borderImage:
          "linear-gradient(135deg, var(--purple-gradient-start), var(--purple-gradient-mid), var(--purple-gradient-end)) 1",
      }}
    >
      <CardHeader className="relative">
        <div className="flex items-center gap-6">
          <div className="p-2">
            <img src="/spotify_logo_small.svg" alt="Spotify" className="h-14 w-14" />
          </div>
          <div className="flex flex-col justify-center">
            <CardTitle className="text-2xl">Recently Played Tracks</CardTitle>
            <CardDescription>Your listening history from the past few days</CardDescription>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs pointer-events-none opacity-60 z-0 hidden md:block">
          <AudioWave />
        </div>
      </CardHeader>
      <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-bright-purple/20 to-zinc-800"></div>
      <CardContent>
        {isLoadingRecent || isRefreshing ? (
          <LoadingSkeleton count={10} type="track" />
        ) : recentlyPlayed?.items?.length > 0 ? (
          <>
            <ListContainer>
              {recentlyPlayed.items.slice(0, visibleRecentCount).map((item: any, index: number) => {
                // Add genres to the track from the artist info
                const trackWithGenres = {
                  ...item.track,
                  genres: getTrackGenres(item.track),
                }

                return (
                  <div key={`${item.track.id}-${index}`}>
                    <TrackItem
                      track={trackWithGenres}
                      additionalInfo={`Played on ${formatDate(item.played_at)}`}
                      isRecentlyPlayed={true}
                      index={index}
                    />
                  </div>
                )
              })}
            </ListContainer>

            <LoadMoreButton onClick={loadMoreRecent} isVisible={visibleRecentCount < recentlyPlayed.items.length} />
          </>
        ) : (
          <p className="text-center py-8 text-zinc-500">No recently played tracks found.</p>
        )}
      </CardContent>
    </Card>
  )

  const TopTracksContent = () => (
    <Card
      className="bg-gradient-to-r from-zinc-900 to-black border border-transparent"
      style={{
        borderImage:
          "linear-gradient(135deg, var(--purple-gradient-start), var(--purple-gradient-mid), var(--purple-gradient-end)) 1",
      }}
    >
      <CardHeader className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-6">
            <div className="p-2">
              <img src="/spotify_logo_small.svg" alt="Spotify" className="h-14 w-14" />
            </div>
            <div className="flex flex-col justify-center">
              <CardTitle className="text-2xl">Your Top Tracks</CardTitle>
              <CardDescription>
                The songs you've listened to most over{" "}
                {timeRange === "short_term"
                  ? "the last 4 weeks"
                  : timeRange === "medium_term"
                    ? "the last 6 months"
                    : "all time"}
              </CardDescription>
            </div>
          </div>
          <TimeRangeSelector selectedRange={timeRange} onChange={handleTimeRangeChange} />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs pointer-events-none opacity-60 z-0 hidden md:block">
          <AudioWave />
        </div>
      </CardHeader>
      <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-bright-purple/20 to-zinc-800"></div>
      <CardContent>
        {isLoadingTracks || isRefreshing ? (
          <LoadingSkeleton count={10} type="track" />
        ) : currentTopTracks?.items?.length > 0 ? (
          <>
            <ListContainer>
              {currentTopTracks.items.slice(0, visibleTracksCount).map((track: any, index: number) => {
                // Add genres to the track from the artist info
                const trackWithGenres = {
                  ...track,
                  genres: getTrackGenres(track),
                }

                return <TrackItem key={`${track.id}-${index}`} track={trackWithGenres} index={index} />
              })}
            </ListContainer>

            <LoadMoreButton onClick={loadMoreTracks} isVisible={visibleTracksCount < currentTopTracks.items.length} />
          </>
        ) : (
          <p className="text-center py-8 text-zinc-500">No top tracks found for this time period.</p>
        )}
      </CardContent>
    </Card>
  )

  const TopArtistsContent = () => (
    <Card
      className="bg-gradient-to-r from-zinc-900 to-black border border-transparent"
      style={{
        borderImage:
          "linear-gradient(135deg, var(--purple-gradient-start), var(--purple-gradient-mid), var(--purple-gradient-end)) 1",
      }}
    >
      <CardHeader className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-6">
            <div className="p-2">
              <img src="/spotify_logo_small.svg" alt="Spotify" className="h-14 w-14" />
            </div>
            <div className="flex flex-col justify-center">
              <CardTitle className="text-2xl">Your Top Artists</CardTitle>
              <CardDescription>
                The artists you've listened to most over{" "}
                {timeRange === "short_term"
                  ? "the last 4 weeks"
                  : timeRange === "medium_term"
                    ? "the last 6 months"
                    : "all time"}
              </CardDescription>
            </div>
          </div>
          <TimeRangeSelector selectedRange={timeRange} onChange={handleTimeRangeChange} />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs pointer-events-none opacity-60 z-0 hidden md:block">
          <AudioWave />
        </div>
      </CardHeader>
      <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-bright-purple/20 to-zinc-800"></div>
      <CardContent>
        {isLoadingArtists || isRefreshing ? (
          <LoadingSkeleton count={10} type="artist" />
        ) : currentTopArtists?.items?.length > 0 ? (
          <>
            <ListContainer>
              {currentTopArtists.items.slice(0, visibleArtistsCount).map((artist: any, index: number) => (
                <ArtistItem key={`${artist.id}-${index}`} artist={artist} index={index} />
              ))}
            </ListContainer>

            <LoadMoreButton
              onClick={loadMoreArtists}
              isVisible={visibleArtistsCount < currentTopArtists.items.length}
            />
          </>
        ) : (
          <p className="text-center py-8 text-zinc-500">No top artists found for this time period.</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <Suspense fallback={null}>
        <TechGridBackground />
      </Suspense>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6 mt-20 relative z-10 mb-12">
        {/* Top Section with Grid Layout */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Left Column - Vinyl Collection (25%) */}
          <div className="w-full md:w-[25%]">
            <div className="sticky top-24">
              <Suspense fallback={<div className="w-full h-[300px] bg-zinc-900/50 rounded-lg animate-pulse"></div>}>
                <DynamicVinylCollection />
              </Suspense>
            </div>
          </div>

          {/* Middle Column - Roast Me Button (50%) */}
          <div className="w-full md:w-[50%] flex justify-center">
            <div className="w-full max-w-3xl">
              <RoastMe
                topTracks={currentTopTracks}
                topArtists={currentTopArtists}
                recentlyPlayed={recentlyPlayed}
                activeTab={activeTab}
              />
            </div>
          </div>

          {/* Right Column - Profile Card (25%) */}
          <div className="w-full md:w-[25%] md:self-start">
            {profile && (
              <div className="w-full bg-gradient-to-r from-zinc-900 to-black rounded-xl border border-zinc-800 overflow-hidden shadow-lg">
                <div className="grid grid-cols-2 p-3">
                  {/* Left Column - User Info */}
                  <div className="pr-2">
                    {/* User Info - Top section */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={profile.images?.[0]?.url || "/placeholder.svg?height=40&width=40&query=user"}
                          alt={profile.display_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold truncate">{profile.display_name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {profile.followers.total}
                          </span>
                          {profile.country && (
                            <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-xs">{profile.country}</span>
                          )}
                          <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-xs capitalize">
                            {profile.product}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row - Refresh button and Updated text */}
                    <div className="flex items-center text-xs text-zinc-500">
                      <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="mr-2 bg-zinc-800 hover:bg-zinc-700 text-white p-1.5 rounded-full flex-shrink-0 transition-colors"
                        title="Refresh Data"
                      >
                        {isRefreshing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </button>
                      {lastFetched > 0 && <span>Updated: {new Date(lastFetched).toLocaleTimeString()}</span>}
                    </div>
                  </div>

                  {/* Right Column - Spotify Logo */}
                  <div className="flex flex-col items-center justify-center pl-2 border-l border-zinc-800">
                    <div className="flex flex-col items-center">
                      <img
                        src="/spotify_logo_small.svg"
                        alt="Spotify"
                        className="h-[40px] w-auto mb-2"
                        loading="lazy"
                      />
                      <span className="text-xs text-zinc-500/80 text-center">Connected to Spotify</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Tabs Navigation */}
        <MusicTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        {activeTab === "recently-played" && <RecentlyPlayedContent />}
        {activeTab === "top-tracks" && <TopTracksContent />}
        {activeTab === "top-artists" && <TopArtistsContent />}
      </main>

      <Footer />
    </div>
  )
}
