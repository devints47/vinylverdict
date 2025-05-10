"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { VinylRecord } from "./vinyl-record-unified"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define vinyl designs
const vinylDesigns = [
  {
    id: "snob-classic",
    name: "The Critic",
    labelColor: "purple",
    faceType: "snob",
    labelText: "SNOBSCORE • PREMIUM VINYL • AUDIOPHILE EDITION •",
  },
  {
    id: "happy-beats",
    name: "Happy Beats",
    labelColor: "pink",
    faceType: "happy",
    labelText: "HAPPY BEATS • FEEL GOOD MUSIC • POSITIVE VIBES •",
  },
  {
    id: "cool-grooves",
    name: "Cool Grooves",
    labelColor: "blue",
    faceType: "cool",
    labelText: "COOL GROOVES • SMOOTH LISTENING • CHILL VIBES •",
  },
  {
    id: "surprise-mix",
    name: "Surprise Mix",
    labelColor: "teal",
    faceType: "surprised",
    labelText: "SURPRISE MIX • UNEXPECTED TRACKS • HIDDEN GEMS •",
  },
  {
    id: "red-hot",
    name: "Red Hot",
    labelColor: "red",
    faceType: "snob",
    labelText: "RED HOT • TRENDING TRACKS • CHART TOPPERS •",
  },
]

interface VinylCollectionUnifiedProps {
  className?: string
}

function VinylCollectionUnifiedComponent({ className = "" }: VinylCollectionUnifiedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // Handle screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? vinylDesigns.length - 1 : prevIndex - 1))
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === vinylDesigns.length - 1 ? 0 : prevIndex + 1))
  }, [])

  // Determine quality based on screen size
  const quality = isSmallScreen ? "low" : "medium"

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[300px]">
          <VinylRecord design={vinylDesigns[currentIndex]} quality={quality} />

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Previous vinyl"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Next vinyl"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Vinyl name */}
        <div className="mt-4 text-center">
          <h3 className="text-xl text-purple-500 font-bold">{vinylDesigns[currentIndex].name}</h3>
          <div className="flex justify-center mt-1">
            {vinylDesigns.map((_, index) => (
              <span
                key={index}
                className={`inline-block w-2 h-2 rounded-full mx-1 ${
                  index === currentIndex ? "bg-purple-500" : "bg-zinc-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const VinylCollectionUnified = memo(VinylCollectionUnifiedComponent)
