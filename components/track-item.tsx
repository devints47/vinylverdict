"use client"

import { formatDuration } from "@/lib/spotify-api"
import { getOptimizedSpotifyImage } from "@/lib/image-optimization"
import { useEffect, useState, memo } from "react"

interface TrackItemProps {
  track: {
    id: string
    name: string
    album: {
      name: string
      images: Array<{ url: string }>
      external_urls?: {
        spotify: string
      }
      id?: string
    }
    artists: Array<{
      name: string
      genres?: string[]
      external_urls?: {
        spotify: string
      }
      id?: string
    }>
    duration_ms: number
    external_urls: {
      spotify: string
    }
    genres?: string[]
  }
  index?: number
  showAlbum?: boolean
  additionalInfo?: string
  isRecentlyPlayed?: boolean
}

// Memoize the TrackItem component to prevent unnecessary re-renders
const TrackItem = memo(function TrackItem({
  track,
  index,
  showAlbum = true,
  additionalInfo,
  isRecentlyPlayed = false,
}: TrackItemProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Initial check
    checkMobile()

    // Add resize listener with debounce
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(checkMobile, 100)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  // Set optimized image URL
  useEffect(() => {
    const albumImageUrl = track.album.images[0]?.url || "/abstract-music-album.png"
    const size = isMobile ? 56 : 64
    setImageUrl(getOptimizedSpotifyImage(albumImageUrl, size))
  }, [track.album.images, isMobile])

  // Extract genres from track or artists
  const genres = track.genres || track.artists.flatMap((artist) => artist.genres || []).slice(0, 2)

  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 ${
        isMobile ? "px-1 py-2" : "p-3"
      } rounded-lg hover:bg-gradient-to-r hover:from-zinc-800/70 hover:to-zinc-900/30 transition-colors`}
    >
      {index !== undefined && <div className="w-4 sm:w-6 text-center text-zinc-500 font-mono text-sm">{index + 1}</div>}
      <div className="flex-shrink-0 w-14 sm:w-16 h-14 sm:h-16">
        <a
          href={track.album.external_urls?.spotify || track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          title={`View ${track.album.name} on Spotify`}
          className="block w-full h-full"
        >
          <img
            src={imageUrl || "/abstract-music-album.png"}
            alt={track.album.name}
            className={`w-full h-full object-cover ${isMobile ? "rounded-[2px]" : "rounded-[4px]"}`}
            width={isMobile ? 56 : 64}
            height={isMobile ? 56 : 64}
            loading="lazy"
          />
        </a>
      </div>
      <div className="flex-1 min-w-0 flex flex-col ml-1 sm:ml-2">
        <div>
          <div className="flex items-center gap-1">
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:underline truncate"
            >
              {track.name}
            </a>
            {isRecentlyPlayed && additionalInfo && !isMobile && (
              <span className="text-zinc-500 text-xs">- {additionalInfo}</span>
            )}
          </div>
          <p className="text-zinc-400 text-sm truncate">
            {track.artists.map((artist, i) => (
              <span key={artist.name}>
                {i > 0 && ", "}
                <a
                  href={artist.external_urls?.spotify || `https://open.spotify.com/artist/${artist.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {artist.name}
                </a>
              </span>
            ))}
          </p>
          {showAlbum && (
            <p className="text-zinc-500 text-xs truncate">
              <a
                href={track.album.external_urls?.spotify || `https://open.spotify.com/album/${track.album.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {track.album.name}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Center column for genres */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        {genres && genres.length > 0 && (
          <p className="text-zinc-600 text-xs truncate capitalize text-center max-w-[90%]">{genres.join(", ")}</p>
        )}
      </div>

      <div className="text-zinc-500 text-sm mr-1 sm:mr-0">{formatDuration(track.duration_ms)}</div>
    </div>
  )
})

export { TrackItem }