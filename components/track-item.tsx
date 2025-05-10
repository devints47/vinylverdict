"use client"

import { formatDuration } from "@/lib/spotify-api"
import { useEffect, useState } from "react"

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

export function TrackItem({
  track,
  index,
  showAlbum = true,
  additionalInfo,
  isRecentlyPlayed = false,
}: TrackItemProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Extract genres from track or artists
  const genres = track.genres || track.artists.flatMap((artist) => artist.genres || []).slice(0, 2)

  return (
    <div className="flex items-center gap-1 sm:gap-2 p-3 rounded-lg hover:bg-gradient-to-r hover:from-zinc-800/70 hover:to-zinc-900/30 transition-colors">
      {index !== undefined && <div className="w-4 sm:w-6 text-center text-zinc-500 font-mono text-sm">{index + 1}</div>}
      <div className="flex-shrink-0 w-16 h-16">
        <a
          href={track.album.external_urls?.spotify || track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          title={`View ${track.album.name} on Spotify`}
          className="block w-full h-full"
        >
          <img
            src={track.album.images[0]?.url || "/placeholder.svg?height=64&width=64&query=album"}
            alt={track.album.name}
            className={`w-full h-full object-cover ${isMobile ? "rounded-[2px]" : "rounded-[4px]"}`}
          />
        </a>
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
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
            {isRecentlyPlayed && additionalInfo && <span className="text-zinc-500 text-xs">- {additionalInfo}</span>}
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

      <div className="text-zinc-500 text-sm">{formatDuration(track.duration_ms)}</div>
    </div>
  )
}
