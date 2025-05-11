"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

interface LoadingSkeletonProps {
  count?: number
  type?: "track" | "artist"
}

export function LoadingSkeleton({ count = 5, type = "track" }: LoadingSkeletonProps) {
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

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-1 sm:gap-2 p-3">
          <Skeleton className="w-4 sm:w-6 h-4" />
          <Skeleton loading="lazy" className={`w-16 h-16 ${isMobile ? "rounded-[2px]" : "rounded-[4px]"}`} />
          <div className="flex-1 min-w-0 flex flex-col">
            <Skeleton className="h-4 w-3/4" />
            {type === "artist" && <Skeleton className="h-3 w-1/3" />}
            {type === "track" && <Skeleton className="h-3 w-1/2" />}
            {type === "track" && <Skeleton className="h-3 w-1/3" />}
          </div>

          {/* Center column for genres - hidden on mobile */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <Skeleton className="h-3 w-1/2" />
          </div>

          {type === "track" ? <Skeleton className="w-10 h-4" /> : <Skeleton className="w-24 h-6 rounded-full" />}
        </div>
      ))}
    </div>
  )
}
