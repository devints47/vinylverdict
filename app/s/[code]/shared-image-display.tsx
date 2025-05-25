"use client"

import { useState, useEffect, useRef } from "react"

interface SharedImageDisplayProps {
  imageUrl: string
}

export function SharedImageDisplay({ imageUrl }: SharedImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imageUrl) {
      setHasError(true)
      setIsLoading(false)
      return
    }

    // Reset states when imageUrl changes
    setIsLoading(true)
    setHasError(false)

    // Check if image is already loaded (cached)
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoading(false)
    }
  }, [imageUrl])

  const handleImageLoad = () => {
    console.log("Image loaded successfully")
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl)
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="relative w-full">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-zinc-400 text-sm">Loading image...</p>
          </div>
        </div>
      )}

      {hasError ? (
        <div className="w-full aspect-[9/16] bg-zinc-900 flex flex-col items-center justify-center p-4">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-white text-lg font-medium mb-2">Failed to load image</p>
          <p className="text-zinc-400 text-sm text-center">The image may have been removed or the link is invalid</p>
          <div className="mt-4 p-2 bg-zinc-800 rounded text-xs text-left max-w-full overflow-hidden">
            <p className="truncate">{imageUrl}</p>
          </div>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={imageUrl || "/placeholder.svg"}
          alt="Music Taste Verdict"
          className={`w-full h-auto transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
          style={{ maxHeight: "80vh", objectFit: "contain" }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  )
}
