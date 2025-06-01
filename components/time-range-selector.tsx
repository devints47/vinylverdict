"use client"

import { Button } from "@/components/ui/button"
import type { TimeRange } from "@/lib/spotify-api"
import { useEffect, useState } from "react"

interface TimeRangeSelectorProps {
  selectedRange: TimeRange
  onChange: (range: TimeRange) => void
}

export function TimeRangeSelector({ selectedRange, onChange }: TimeRangeSelectorProps) {
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

  const ranges = [
    {
      value: "short_term" as TimeRange,
      label: "Last Month",
      mobileLabel: "1 Month",
    },
    {
      value: "medium_term" as TimeRange,
      label: "Last 6 Months",
      mobileLabel: "6 Months",
    },
    {
      value: "long_term" as TimeRange,
      label: "All Time",
      mobileLabel: "All Time",
    },
  ]

  return (
    <div className="flex gap-2 w-full">
      {ranges.map((range) => {
        const isSelected = selectedRange === range.value
        
        return (
          <Button
            key={range.value}
            variant="outline"
            size="sm"
            onClick={() => onChange(range.value)}
            className={`
              whitespace-nowrap
              flex-1
              border border-white/20
              ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
              ${isSelected 
                ? 'bg-purple-600 text-white border-purple-500 hover:bg-purple-600' 
                : 'bg-transparent text-white hover:bg-white/10 hover:border-white/30'
              }
              transition-colors duration-200
            `}
          >
            {isMobile ? range.mobileLabel : range.label}
          </Button>
        )
      })}
    </div>
  )
}
