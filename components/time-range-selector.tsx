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
      label: "Last 4 Weeks",
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
    <div className="flex flex-wrap gap-2">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selectedRange === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(range.value)}
          className={selectedRange === range.value ? "btn-gradient holographic-shimmer" : ""}
        >
          {isMobile ? range.mobileLabel : range.label}
        </Button>
      ))}
    </div>
  )
}
