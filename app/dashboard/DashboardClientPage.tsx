"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useVinyl } from "@/contexts/vinyl-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader2, RefreshCw, Users, Clock, ChevronDown, ChevronUp, Info } from "lucide-react"
import { MusicTabs } from "@/components/music-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { TrackItem } from "@/components/track-item"
import { ArtistItem } from "@/components/artist-item"
import { RoastMe } from "@/components/roast-me"
import { TechGridBackground } from "@/components/tech-grid-background"
import { VinylCollection } from "@/components/vinyl-collection"
import { AudioWave } from "@/components/audio-wave"
import type { TimeRange } from "@/lib/spotify-api"
import { formatDate, getArtists } from "@/lib/spotify-api"
import { ListContainer } from "@/components/list-container"
import { VinylVerdictLogo } from "@/components/vinyl-verdict-logo"
import { ContentLoading } from "@/components/content-loading"
import { SimpleDescription } from "@/components/simple-description"

interface UserProfile {
  display_name: string
  images: Array<{ url: string }>
  followers: { total: number }
  country: string
  product: string
  id: string
}

interface ArtistInfo {
  id: string
  name: string
  genres: string[]
  [key: string]: any
}

// User Profile Card Component
function UserProfileCard({
  profile,
  handleRefresh,
  isRefreshing,
  lastFetched,
}: {
  profile: UserProfile | null
  handleRefresh: () => void
  isRefreshing: boolean
  lastFetched: number
}) {
  if (!profile) return null

  return (
    <div className="w-full bg-gradient-to-r from-zinc-900 to-black rounded-xl border border-zinc-800 overflow-hidden shadow-lg md:h-[132px]">
      <div className="grid grid-cols-5 p-2 md:p-3 h-full">
        {/* Left Column - User Info */}
        <div className="col-span-3 pr-2 flex flex-col justify-between h-full">
          {/* User Info - Top section */}
          <div className="flex items-center mb-1">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <img
                src={profile.images?.[0]?.url}
                alt="Profile"
                className="w-full h-full object-cover"
                width={40}
                height={40}
                loading="lazy"
                fetchPriority="high"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate">
                <a
                  href={`https://open.spotify.com/user/${profile.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {profile.display_name}
                </a>
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {profile.followers.total} {profile.followers.total === 1 ? "follower" : "followers"}
                </span>
                {profile.country && (
                  <span className="bg-zinc-800 px-2 py-0.5 rounded-full text-xs">{profile.country}</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row - Refresh button and Updated text */}
          <div className="flex items-center text-xs text-zinc-500 mt-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="mr-2 bg-zinc-800 hover:bg-zinc-700 text-white p-1.5 rounded-full flex-shrink-0 transition-colors"
              title="Refresh Data"
            >
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </button>
            {lastFetched > 0 && <span>Updated: {new Date(lastFetched).toLocaleTimeString()}</span>}
          </div>
        </div>

        {/* Right Column - Spotify Logo */}
        <div className="col-span-2 flex flex-col items-center justify-center pl-2 border-l border-zinc-800">
          <div className="flex flex-col items-center">
            <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" title="Visit Spotify">
              <img
                src="/spotify_logo_small.svg"
                alt="Spotify"
                className="h-[48px] w-auto mb-2"
                width={48}
                height={48}
                loading="eager"
                fetchPriority="high"
              />
            </a>
            <span className="text-xs text-zinc-500/80 text-center mt-4">Connected to Spotify</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Content components for each tab
function RecentlyPlayedContent({
  isLoadingRecent,
  isRefreshing,
  recentlyPlayed,
  visibleRecentCount,
  getTrackGenres,
  loadMoreRecent,
  formatDate,
}: {
  isLoadingRecent: boolean
  isRefreshing: boolean
  recentlyPlayed: any
  visibleRecentCount: number
  getTrackGenres: (track: any) => string[]
  loadMoreRecent: () => void
  formatDate: (date: string) => string
}) {
  return (
    <Card
      className="bg-gradient-to-r from-zinc-900 to-black border border-transparent rounded-t-none"
      style={{
        borderImage:
          "linear-gradient(135deg, var(--purple-gradient-start), var(--purple-gradient-mid), var(--purple-gradient-end)) 1",
      }}
    >
      <CardHeader className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-6">
            <div className="p-2 flex-shrink-0">
              <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" title="Visit Spotify">
                <img
                  src="/spotify_logo_small.svg"
                  alt="Spotify"
                  className="h-14 w-14"
                  width={56}
                  height={56}
                  loading="eager"
                />
              </a>
            </div>
            <div className="flex flex-col justify-center">
              <CardTitle className="text-xl sm:text-2xl">Recently Played</CardTitle>
              <CardDescription className="min-h-[1.5rem]">Your most recent listening history</CardDescription>
            </div>
          </div>
          <div className="flex items-center text-zinc-400 bg-zinc-800/50 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 mr-2 text-bright-purple" />
            <span className="text-xs sm:text-sm">Your Spotify recently played tracks</span>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs pointer-events-none z-0">
          <AudioWave />
        </div>
      </CardHeader>
      <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-bright-purple/20 to-zinc-800"></div>
      <CardContent className="px-1 sm:px-6 py-6 pt-0">
        {isLoadingRecent || isRefreshing ? (
          <ContentLoading message="Loading your recently played tracks..." showSkeleton={true} itemCount={20} />
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

            {visibleRecentCount < recentlyPlayed.items.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreRecent}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-full text-xs sm:text-sm transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-8 text-zinc-500">No recently played tracks found.</p>
        )}
      </CardContent>
    </Card>
  )
}

function TopTracksContent({
  timeRange,
  handleTimeRangeChange,
  isLoadingTracks,
  isRefreshing,
  currentTopTracks,
  visibleTracksCount,
  getTrackGenres,
  loadMoreTracks,
}: {
  timeRange: TimeRange
  handleTimeRangeChange: (range: TimeRange) => void
  isLoadingTracks: boolean
  isRefreshing: boolean
  currentTopTracks: any
  visibleTracksCount: number
  getTrackGenres: (track: any) => string[]
  loadMoreTracks: () => void
}) {
  return (
    <Card
      className="bg-gradient-to-r from-zinc-900 to-black border border-transparent rounded-t-none"
      style={{
        borderImage:
          "linear-gradient(135deg, var(--purple-gradient-start), var(--purple-gradient-mid), var(--purple-gradient-end)) 1",
      }}
    >
      <CardHeader className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-6">
            <div className="p-2 flex-shrink-0">
              <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" title="Visit Spotify">
                <img
                  src="/spotify_logo_small.svg"
                  alt="Spotify"
                  className="h-14 w-14"
                  width={56}
                  height={56}
                  loading="eager"
                />
              </a>
            </div>
            <div className="flex flex-col justify-center">
              <CardTitle className="text-xl sm:text-2xl">Your Top Tracks</CardTitle>
              <CardDescription className="min-h-[1.5rem]">
                Songs you've listened to the most{" "}
                {timeRange === "short_term"
                  ? "over the last month"
                  : timeRange === "medium_term"
                    ? "over the last 6 months"
                    : "of all time"}
              </CardDescription>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <TimeRangeSelector selectedRange={timeRange} onChange={handleTimeRangeChange} />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs pointer-events-none z-0">
          <AudioWave />
        </div>
      </CardHeader>
      <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-bright-purple/20 to-zinc-800"></div>
      <CardContent className="px-1 sm:px-6 py-6 pt-0">
        {isLoadingTracks || isRefreshing ? (
          <ContentLoading message="Loading your top tracks..." showSkeleton={true} itemCount={20} />
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

            {visibleTracksCount < currentTopTracks.items.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreTracks}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-full text-xs sm:text-sm transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-8 text-zinc-500">No top tracks found for this time period.</p>
        )}
      </CardContent>
    </Card>
  )
}

function TopArtistsContent({
  timeRange,
  handleTimeRangeChange,
  isLoadingArtists,
  isRefreshing,
  currentTopArtists,
  visibleArtistsCount,
  loadMoreArtists,
}: {
  timeRange: TimeRange
  handleTimeRangeChange: (range: TimeRange) => void
  isLoadingArtists: boolean
  isRefreshing: boolean
  currentTopArtists: any
  visibleArtistsCount: number
  loadMoreArtists: () => void
}) {
  return (
    <Card
      className="bg-gradient-to-r from-zinc-900 to-black border border-transparent rounded-t-none"
      style={{
        borderImage:
          "linear-gradient(135deg, var(--purple-gradient-start), var(--purple-gradient-mid), var(--purple-gradient-end)) 1",
      }}
    >
      <CardHeader className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-6">
            <div className="p-2 flex-shrink-0">
              <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" title="Visit Spotify">
                <img
                  src="/spotify_logo_small.svg"
                  alt="Spotify"
                  className="h-14 w-14"
                  width={56}
                  height={56}
                  loading="eager"
                />
              </a>
            </div>
            <div className="flex flex-col justify-center">
              <CardTitle className="text-xl sm:text-2xl">Your Top Artists</CardTitle>
              <CardDescription className="min-h-[1.5rem]">
                Artists you've listened to the most{" "}
                {timeRange === "short_term"
                  ? "over the last 4 weeks"
                  : timeRange === "medium_term"
                    ? "over the last 6 months"
                    : "of all time"}
              </CardDescription>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <TimeRangeSelector selectedRange={timeRange} onChange={handleTimeRangeChange} />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs pointer-events-none z-0">
          <AudioWave />
        </div>
      </CardHeader>
      <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-bright-purple/20 to-zinc-800"></div>
      <CardContent className="px-1 sm:px-6 py-6 pt-0">
        {isLoadingArtists || isRefreshing ? (
          <ContentLoading message="Loading your top artists..." showSkeleton={true} itemCount={20} />
        ) : currentTopArtists?.items?.length > 0 ? (
          <>
            <ListContainer>
              {currentTopArtists.items.slice(0, visibleArtistsCount).map((artist: any, index: number) => (
                <ArtistItem key={`${artist.id}-${index}`} artist={artist} index={index} />
              ))}
            </ListContainer>

            {visibleArtistsCount < currentTopArtists.items.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreArtists}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-full text-xs sm:text-sm transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-8 text-zinc-500">No top artists found for this time period.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardClientPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { selectedVinyl } = useVinyl()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

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

  // Pagination state
  const [visibleRecentCount, setVisibleRecentCount] = useState(20)
  const [visibleTracksCount, setVisibleTracksCount] = useState(20)
  const [visibleArtistsCount, setVisibleArtistsCount] = useState(20)

  // Cache duration - 1 hour in milliseconds
  const CACHE_DURATION = 60 * 60 * 1000

  // Get current data based on selected tab and time range
  const currentTopTracks = topTracks[timeRange]
  const currentTopArtists = topArtists[timeRange]

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

  // Get genres for a track based on its artists
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

  // Authentication check and data fetching
  useEffect(() => {
    let isMounted = true

    const checkAuthAndFetchData = async () => {
      try {
        // If not authenticated and not loading, redirect to login
        if (!isAuthenticated && !isLoading) {
          console.log("Not authenticated, redirecting to login")
          router.push("/login")
          return
        }

        // If authenticated and not loading, fetch data
        if (isAuthenticated && !isLoading && isMounted) {
          await fetchAllData()
        }
      } catch (err) {
        console.error("Error during authentication/data fetching:", err)
        if (isMounted) {
          setError("An error occurred during authentication or data fetching.")
        }
      }
    }

    checkAuthAndFetchData()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, isLoading, router, fetchAllData])

  // Add page visibility handling for better performance and back/forward cache
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible - check if data needs refreshing
        const now = Date.now()
        if (lastFetched > 0 && now - lastFetched > CACHE_DURATION) {
          // Data is stale, refresh it
          fetchAllData(false)
        }
      }
      // When page becomes hidden, we could clean up resources here if needed
    }

    // Add beforeunload handler for better cache performance
    const handleBeforeUnload = () => {
      // Cancel any ongoing requests before page unload
      // This helps with back/forward cache
      return undefined
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true })
    window.addEventListener('beforeunload', handleBeforeUnload, { passive: true })

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [lastFetched, fetchAllData])

  // Show loading state
  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
        <TechGridBackground />
        <Navbar forceLogout={true} />
        
        {/* Fixed positioned loading content to appear in viewport center */}
        <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="flex flex-col items-center pointer-events-auto">
            <VinylVerdictLogo size={50} className="mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Loading your profile</h1>
            <p className="text-zinc-400">Please wait while we fetch your data...</p>
              </div>
          </div>
        
        {/* Invisible spacer to maintain layout during loading */}
        <main className="flex-1 container mx-auto px-1 sm:px-4 py-6 mt-20 relative z-10 mb-12 min-h-[calc(100vh-280px)]">
          <div className="opacity-0 pointer-events-none">
            {/* Invisible content to maintain space */}
            <div className="h-96"></div>
        </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  // Create the profile card component
  const profileCard = (
    <UserProfileCard
      profile={profile}
      handleRefresh={handleRefresh}
      isRefreshing={isRefreshing}
      lastFetched={lastFetched}
    />
  )

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <TechGridBackground />
      <Navbar forceLogout={true} />

      <main className="flex-1 container mx-auto px-1 sm:px-4 py-6 mt-20 relative z-10 mb-12 min-h-[calc(100vh-280px)]">
        {/* Top Section with Grid Layout */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 md:mb-4">
          {/* Mobile-first layout: Profile Card first on mobile, then Vinyl Collection */}
          <div className="w-full md:hidden mb-6">{profileCard}</div>

          {/* Left Column - Vinyl Collection (25% on desktop) */}
          <div className="w-full md:w-[25%]">
            <div className="sticky top-24">
              {/* Fixed vinyl container to prevent layout shifts */}
              <div className="flex justify-center">
                <div className="w-[300px]" style={{ contain: 'layout' }}>
                  <VinylCollection />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Critic Description and Roast Me Button (50% on desktop) */}
          <div className="w-full md:w-[50%] flex flex-col items-center px-[2.5%]">
            {/* Fixed width container for stable text rendering */}
            <div className="w-full max-w-[600px] mx-auto" style={{ contain: 'layout' }}>
              {/* SimpleDescription component */}
              <SimpleDescription
                description={selectedVinyl?.description || ""}
                variant="dashboard"
                selectedVinyl={selectedVinyl}
              />
            </div>

            {/* Roast Me button positioned directly below the description box */}
            <div className="mt-6 md:mt-4 w-full max-w-[600px] mx-auto">
              <RoastMe
                topTracks={currentTopTracks}
                topArtists={currentTopArtists}
                recentlyPlayed={recentlyPlayed}
                activeTab={activeTab}
                selectedVinyl={selectedVinyl}
              />
            </div>
          </div>

          {/* Right Column - Profile Card (25% on desktop) - Hidden on mobile as it's moved to the top */}
          <div className="w-full md:w-[25%] md:self-start hidden md:block">{profileCard}</div>
        </div>

        {/* Tabs and Content Section - Connected */}
        <div>
          {/* Custom Tabs Navigation */}
          <MusicTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Tab Content - Connected directly to tabs */}
          {activeTab === "recently-played" && (
            <RecentlyPlayedContent
              isLoadingRecent={isLoadingRecent}
              isRefreshing={isRefreshing}
              recentlyPlayed={recentlyPlayed}
              visibleRecentCount={visibleRecentCount}
              getTrackGenres={getTrackGenres}
              loadMoreRecent={loadMoreRecent}
              formatDate={formatDate}
            />
          )}
          {activeTab === "top-tracks" && (
            <TopTracksContent
              timeRange={timeRange}
              handleTimeRangeChange={handleTimeRangeChange}
              isLoadingTracks={isLoadingTracks}
              isRefreshing={isRefreshing}
              currentTopTracks={currentTopTracks}
              visibleTracksCount={visibleTracksCount}
              getTrackGenres={getTrackGenres}
              loadMoreTracks={loadMoreTracks}
            />
          )}
          {activeTab === "top-artists" && (
            <TopArtistsContent
              timeRange={timeRange}
              handleTimeRangeChange={handleTimeRangeChange}
              isLoadingArtists={isLoadingArtists}
              isRefreshing={isRefreshing}
              currentTopArtists={currentTopArtists}
              visibleArtistsCount={visibleArtistsCount}
              loadMoreArtists={loadMoreArtists}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}