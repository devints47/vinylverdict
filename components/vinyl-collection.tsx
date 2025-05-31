"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { VinylRecord } from "./vinyl-record"
import { useVinyl } from "@/contexts/vinyl-context"

// Define vinyl design type for better type safety
export interface VinylDesign {
  id: string
  name: string
  labelColor: string
  faceType: "snob" | "happy" | "cool" | "surprised"
  labelText: string
  description: string
  assistantType?: string // Add assistant type to identify which assistant to use
}

// Define flip direction for animation
type FlipDirection = "left" | "right" | "none"

// Helper function to convert VinylDesign to vinyl context format
const convertToContextFormat = (design: VinylDesign) => ({
  id: design.assistantType || design.id,
  name: design.name,
  description: design.description,
  color: design.labelColor, // Map labelColor to color
  assistantType: design.assistantType || design.id,
})

export function VinylCollection({ onSelectVinyl }: { onSelectVinyl?: (design: VinylDesign) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [flipDirection, setFlipDirection] = useState<FlipDirection>("none")
  const { selectedVinyl, setSelectedVinyl } = useVinyl()

  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum distance for a swipe (in pixels)
  const minSwipeDistance = 50

  // Touch event handlers for swipe detection
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null) // Reset touch end
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe left = move to next vinyl (right direction)
      nextVinyl()
    } else if (isRightSwipe) {
      // Swipe right = move to previous vinyl (left direction)
      prevVinyl()
    }
  }

  // Define our vinyl designs
  const vinylDesigns: VinylDesign[] = [
    {
      id: "music-snob",
      name: "Music Snob",
      labelColor: "purple",
      faceType: "snob",
      labelText: "VINYLVERDICT • PREMIUM VINYL • AUDIOPHILE EDITION •",
      description:
        "The most discerning and judgmental of our critics. Music Snob has strong opinions about everything from production quality to lyrical depth. Prepare for a thorough dissection of your musical choices with zero mercy.",
      assistantType: "snob", // This is the Music Snob assistant
    },
    {
      id: "armchair-therapist",
      name: "Armchair Therapist",
      labelColor: "orange",
      faceType: "surprised",
      labelText: "THERAPY • PSYCHOANALYSIS • DEEP INSIGHTS • SESSION •",
      description:
        "A straight-shooting psychological analyst who connects your music choices to your deepest emotional patterns and relationship dynamics. They'll tell you exactly what your playlist reveals about your psyche, personal growth, and love life.",
      assistantType: "therapist", // New assistant type for Armchair Therapist
    },
    {
      id: "taste-validator",
      name: "Taste Validator",
      labelColor: "teal",
      faceType: "happy",
      labelText: "VALIDATION • APPRECIATION • AFFIRMATION • PRAISE •",
      description:
        "The ultimate music enthusiast who sees the beauty in every genre and artist. Taste Validator celebrates your musical journey with genuine excitement and positivity, finding the artistic merit in even your most questionable choices.",
      assistantType: "worshipper", // Keep the assistantType the same for API compatibility
    },
    {
      id: "indie-vibes",
      name: "The Historian",
      labelColor: "blue",
      faceType: "cool",
      labelText: "INDIE • ALTERNATIVE • UNDERGROUND • EXCLUSIVE •",
      description:
        "An ancient keeper of musical secrets who unveils the mysterious and forgotten lore behind your listening habits. The Historian analyzes your taste through an esoteric lens, revealing hidden connections and mythical knowledge about your musical journey.",
      assistantType: "historian", // Added assistantType for The Historian
    },
  ]

  // Set the initial active index based on the selected vinyl from context
  useEffect(() => {
    if (selectedVinyl) {
      const index = vinylDesigns.findIndex(
        (design) => design.assistantType === selectedVinyl.assistantType || design.id === selectedVinyl.id,
      )

      if (index !== -1) {
        setActiveIndex(index)
      }
    }
  }, [selectedVinyl])

  // Set the initial vinyl on mount
  useEffect(() => {
    // Only set if not already set from localStorage
    if (!selectedVinyl || !selectedVinyl.assistantType) {
      const initialVinyl = vinylDesigns[activeIndex]
      setSelectedVinyl(convertToContextFormat(initialVinyl))
      if (onSelectVinyl) {
        onSelectVinyl(initialVinyl)
      }
    } else if (onSelectVinyl) {
      // If we already have a selected vinyl from localStorage, find the corresponding design and call onSelectVinyl
      const correspondingDesign = vinylDesigns.find(
        (design) => design.assistantType === selectedVinyl.assistantType || design.id === selectedVinyl.id
      )
      if (correspondingDesign) {
        onSelectVinyl(correspondingDesign)
      }
    }
  }, []) // Empty dependency array ensures this only runs once on mount

  // Navigation functions
  const nextVinyl = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setFlipDirection("right")
    const newIndex = (activeIndex + 1) % vinylDesigns.length

    // Delay the actual index change to allow for animation
    setTimeout(() => {
      setActiveIndex(newIndex)
      const newVinyl = vinylDesigns[newIndex]
      setSelectedVinyl(convertToContextFormat(newVinyl))
      if (onSelectVinyl) {
        onSelectVinyl(newVinyl)
      }
    }, 250) // Half of the transition time

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
      setFlipDirection("none")
    }, 500)
  }

  const prevVinyl = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setFlipDirection("left")
    const newIndex = (activeIndex - 1 + vinylDesigns.length) % vinylDesigns.length

    // Delay the actual index change to allow for animation
    setTimeout(() => {
      setActiveIndex(newIndex)
      const newVinyl = vinylDesigns[newIndex]
      setSelectedVinyl(convertToContextFormat(newVinyl))
      if (onSelectVinyl) {
        onSelectVinyl(newVinyl)
      }
    }, 250) // Half of the transition time

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
      setFlipDirection("none")
    }, 500)
  }

  const selectVinyl = (index: number) => {
    if (isTransitioning || index === activeIndex) return
    setIsTransitioning(true)

    // Determine flip direction based on index difference
    const direction = index > activeIndex ? "right" : "left"
    setFlipDirection(direction)

    // Delay the actual index change to allow for animation
    setTimeout(() => {
      setActiveIndex(index)
      const newVinyl = vinylDesigns[index]
      setSelectedVinyl(convertToContextFormat(newVinyl))
      if (onSelectVinyl) {
        onSelectVinyl(newVinyl)
      }
    }, 250) // Half of the transition time

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
      setFlipDirection("none")
    }, 500)
  }

  return (
    <div className="flex flex-col items-center" style={{ contain: 'layout' }}>
      {/* Vinyl Record Container - ensures proper centering and containment */}
      <div className="flex justify-center items-center w-full mb-4">
        {/* Fixed size container to prevent layout shifts */}
        <div
          className="vinyl-container relative select-none"
          style={{
            width: "300px",
            height: "300px",
            contain: "layout style",
            overflow: "visible",
            flexShrink: 0, // Prevent shrinking
            touchAction: "pan-y", // Allow vertical scrolling but prevent horizontal pan
            userSelect: "none", // Prevent text selection during swipe
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Vinyl sizing wrapper with 3D perspective */}
          <div
            className="w-full h-full perspective-1000 group" // Added group class for hover targeting
            style={{
              transformStyle: "preserve-3d",
              transform:
                flipDirection === "none"
                  ? "rotateY(0deg)"
                  : flipDirection === "right"
                    ? `rotateY(${isTransitioning ? "90deg" : "0deg"})`
                    : `rotateY(${isTransitioning ? "-90deg" : "0deg"})`,
              transition: "transform 500ms ease",
            }}
          >
            <VinylRecord
              design={vinylDesigns[activeIndex]}
              key={vinylDesigns[activeIndex].id}
              flipDirection={flipDirection}
              isTransitioning={isTransitioning}
              onClick={nextVinyl}
              className="transition-all duration-300 group-hover:scale-[1.02]" // Added subtle scale effect on hover
            />
          </div>
        </div>
      </div>

      {/* Vinyl Selection Controls with fixed positioning */}
      <div className="flex flex-col items-center mt-2">
        {/* Title and Navigation Buttons with fixed width container */}
        <div className="relative flex items-center justify-center w-full mb-2">
          {/* Fixed width container for consistent layout */}
          <div className="w-80 h-10 flex items-center justify-between">
            {/* Left button with fixed position */}
            <button
              onClick={prevVinyl}
              disabled={isTransitioning}
              className="bg-zinc-800/50 hover:bg-zinc-700/70 rounded-full p-2 transition-colors disabled:opacity-50 absolute left-0"
              aria-label="Previous vinyl"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>

            {/* Title with fixed width and centered */}
            <div className="w-full text-center px-10">
              <h3 className="text-xl font-bold text-purple-gradient truncate">{vinylDesigns[activeIndex].name}</h3>
            </div>

            {/* Right button with fixed position */}
            <button
              onClick={nextVinyl}
              disabled={isTransitioning}
              className="bg-zinc-800/50 hover:bg-zinc-700/70 rounded-full p-2 transition-colors disabled:opacity-50 absolute right-0"
              aria-label="Next vinyl"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="flex gap-2 mb-4">
          {vinylDesigns.map((design, index) => (
            <button
              key={design.id}
              onClick={() => selectVinyl(index)}
              disabled={isTransitioning}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === activeIndex ? "bg-bright-purple" : "bg-zinc-600 hover:bg-zinc-500"
              } disabled:opacity-50`}
              aria-label={`Select ${design.name}`}
              aria-current={index === activeIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
