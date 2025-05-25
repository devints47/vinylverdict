"use client"

import { useState } from "react"

interface SharedImageDisplayProps {
  imageUrl: string
}

export function SharedImageDisplay({ imageUrl }: SharedImageDisplayProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  if (imageError) {
    return (
      <div className="w-full aspect-[9/16] bg-zinc-800 rounded-lg flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-xl font-semibold mb-2 text-white">Image Not Available</h3>
        <p className="text-zinc-400 mb-4">This shared verdict image could not be loaded.</p>
        <p className="text-sm text-zinc-500">The image may have expired or been removed.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 bg-zinc-800 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      )}
      <img
        src={imageUrl || "/placeholder.svg"}
        alt="Music Taste Verdict"
        className="w-full h-auto"
        style={{ maxHeight: "80vh", objectFit: "contain" }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  )
}
