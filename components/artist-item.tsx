"use client"

import { useEffect, useState, memo } from "react"

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

// Memoize the ArtistItem component to prevent unnecessary re-renders
const ArtistItem = memo(function ArtistItem({ artist, index }: ArtistItemProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>(artist.images[0]?.url || "/diverse-artists-studio.png")

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

  // Set image URL directly from the artist data
  useEffect(() => {
    // Use the first image from the artist or fallback to a placeholder
    const newImageUrl = artist.images[0]?.url || "/diverse-artists-studio.png"
    if (newImageUrl && newImageUrl !== imageUrl) {
      setImageUrl(newImageUrl)
    }
  }, [artist.images, imageUrl])

  // Format follower count with commas
  const formatFollowers = (count: number): string => {
    return count.toLocaleString()
  }

  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 ${
        isMobile ? "px-1 py-2" : "p-3"
      } rounded-lg hover:bg-gradient-to-r hover:from-zinc-800/70 hover:to-zinc-900/30 transition-colors`}
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
            src={imageUrl || "/diverse-artists-studio.png"}
            alt={artist.name}
            className={`w-full h-full object-cover ${isMobile ? "rounded-[2px]" : "rounded-[4px]"}`}
            width={isMobile ? 56 : 64}
            height={isMobile ? 56 : 64}
            loading="lazy"
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
})

export { ArtistItem }
