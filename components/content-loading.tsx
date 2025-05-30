"use client"

import { memo } from "react"

interface ContentLoadingProps {
  message?: string
  itemCount?: number
  showSkeleton?: boolean
}

// Skeleton item that matches the track/artist item layout
const SkeletonItem = memo(function SkeletonItem({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 px-1 py-2 sm:p-3 rounded-lg animate-pulse">
      {/* Index number */}
      <div className="w-4 sm:w-6 text-center">
        <div className="w-3 h-4 bg-zinc-700 rounded"></div>
      </div>
      
      {/* Album/Artist image */}
      <div className="flex-shrink-0 w-14 sm:w-16 h-14 sm:h-16">
        <div className="w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-700 rounded-[2px] sm:rounded-[4px]"></div>
      </div>
      
      {/* Content area */}
      <div className="flex-1 min-w-0 flex flex-col ml-1 sm:ml-2 gap-1">
        {/* Main title */}
        <div className="w-3/4 h-4 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 rounded animate-shimmer"></div>
        {/* Artist/subtitle */}
        <div className="w-1/2 h-3 bg-zinc-700 rounded"></div>
        {/* Album name (for tracks) */}
        <div className="w-2/3 h-3 bg-zinc-800 rounded"></div>
      </div>

      {/* Center column for genres (desktop) */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <div className="w-16 h-3 bg-zinc-800 rounded"></div>
      </div>

      {/* Duration/Popularity */}
      <div className="mr-1 sm:mr-0">
        <div className="w-12 h-4 bg-zinc-700 rounded"></div>
      </div>
    </div>
  )
})

// Main loading component with fixed height
const ContentLoading = memo(function ContentLoading({ 
  message = "Loading...", 
  itemCount = 20,
  showSkeleton = true 
}: ContentLoadingProps) {
  // Calculate fixed height based on item dimensions
  // Mobile: py-2 (8px top + 8px bottom) + 56px image = ~72px per item
  // Desktop: p-3 (12px top + 12px bottom) + 64px image = ~88px per item
  // Adding some extra space for gaps + Load More button space (~60px)
  const loadMoreButtonHeight = 60 // mt-6 (24px) + py-2 (16px) + text height (~20px)
  const mobileHeight = itemCount * 76 + loadMoreButtonHeight // 72px + 4px gap per item + button
  const desktopHeight = itemCount * 92 + loadMoreButtonHeight // 88px + 4px gap per item + button

  if (showSkeleton) {
    return (
      <div className="w-full">
        {/* Global shimmer animation and responsive heights */}
        <style jsx global>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          .content-loading-container {
            min-height: ${mobileHeight}px;
          }
          @media (min-width: 640px) {
            .content-loading-container {
              min-height: ${desktopHeight}px;
            }
          }
        `}</style>
        
        <div className="content-loading-container space-y-1">
          {Array.from({ length: itemCount }, (_, index) => (
            <SkeletonItem key={index} index={index} />
          ))}
          
          {/* Skeleton Load More button */}
          <div className="flex justify-center mt-6">
            <div className="bg-zinc-700 hover:bg-zinc-600 text-transparent px-6 py-2 rounded-full text-sm animate-pulse">
              Load More
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback spinner loading (for other use cases)
  return (
    <div 
      className="flex flex-col items-center justify-center py-12"
      style={{ minHeight: `${mobileHeight}px` }}
    >
      {/* Spinning vinyl record loader */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 animate-spin"></div>
        <div className="absolute inset-2 w-12 h-12 rounded-full bg-black"></div>
        <div className="absolute inset-6 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
      </div>
      
      {/* Loading text with gradient */}
      <div className="text-center">
        <h3 className="text-lg font-medium bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
          {message}
        </h3>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
})

export { ContentLoading }
