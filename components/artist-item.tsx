"use client"

import { useEffect, useState } from "react"

interface ArtistItemProps {
  artist: {
    id: string
    name: string
    images: Array<{ url: string }>
    genres: string[]
    popularity: number
    followers?: {
      href: string | null
      total: number
    }
    external_urls: {
      spotify: string
    }
  }
  index?: number
}

export function ArtistItem({ artist, index }: ArtistItemProps) {
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

  // Format follower count with commas
  const formatFollowers = (count: number): string => {
    return count.toLocaleString()
  }

  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 ${isMobile ? "px-1 py-2" : "p-3"} rounded-lg hover:bg-gradient-to-r hover:from-zinc-800/70 hover:to-zinc-900/30 transition-colors`}
    >
      {index !== undefined && <div className="w-4 sm:w-6 text-center text-zinc-500 font-mono text-sm">{index + 1}</div>}
      <div className="flex-shrink-0 w-14 sm:w-16 h-14 sm:h-16">
        <a
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          title={`View ${artist.name} on Spotify`}
          className="block w-full h-full"
        >
          <img
            src={artist.images[0]?.url || "/placeholder.svg?height=64&width=64&query=artist"}
            alt={artist.name}
            className={`w-full h-full object-cover ${isMobile ? "rounded-[2px]" : "rounded-[4px]"}`}
          />
        </a>
      </div>
      <div className="flex-1 min-w-0 ml-1 sm:ml-2">
        <a
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white hover:underline truncate block"
        >
          {artist.name}
        </a>
        {artist.followers && (
          <p className="text-zinc-500 text-xs">{formatFollowers(artist.followers.total)} followers</p>
        )}
      </div>

      {/* Center column for genres */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        {artist.genres && artist.genres.length > 0 && (
          <p className="text-zinc-600 text-xs truncate capitalize text-center max-w-[90%]">
            {artist.genres.slice(0, 3).join(", ")}
            {artist.genres.length > 3 && "..."}
          </p>
        )}
      </div>

      <div className="bg-zinc-800 px-2 sm:px-3 py-1 rounded-full text-xs mr-1 sm:mr-0">
        {isMobile ? `${artist.popularity}` : `Popularity: ${artist.popularity}`}
      </div>
    </div>
  )
}
