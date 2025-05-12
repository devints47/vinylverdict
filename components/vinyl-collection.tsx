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

export function VinylCollection({ onSelectVinyl }: { onSelectVinyl?: (design: VinylDesign) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [flipDirection, setFlipDirection] = useState<FlipDirection>("none")
  const { selectedVinyl, setSelectedVinyl } = useVinyl()

  // Define our vinyl designs
  const vinylDesigns: VinylDesign[] = [
    {
      id: "music-snob",
      name: "Music Snob",
      labelColor: "purple",
      faceType: "snob",
      labelText: "SNOBSCORE • PREMIUM VINYL • AUDIOPHILE EDITION •",
      description:
        "The most discerning and judgmental of our critics. Music Snob has strong opinions about everything from production quality to lyrical depth. Prepare for a thorough dissection of your musical choices with zero mercy.",
      assistantType: "snob", // This is the Music Snob assistant
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
        "A walking encyclopedia of music history and cultural context. The Historian will analyze your taste through the lens of musical movements, influences, and the artists' place in the greater musical canon.",
    },
    {
      id: "pop-hits",
      name: "Pop Sensation",
      labelColor: "pink",
      faceType: "happy",
      labelText: "TOP CHARTS • DANCE HITS • PARTY ANTHEMS • REMIX •",
      description:
        "Enthusiastic about all things mainstream and catchy. Pop Sensation judges your playlist based on its danceability, chart performance, and viral potential. Expects maximum energy and hooks.",
    },
    {
      id: "classic-rock",
      name: "Rock Legend",
      labelColor: "red",
      faceType: "surprised",
      labelText: "CLASSIC ROCK • GUITAR SOLOS • HEADBANGERS • LIVE •",
      description:
        "A true believer in the power of electric guitars and drum solos. Rock Legend evaluates your music based on its raw energy, instrumental prowess, and authenticity. Expects music that makes you want to headbang.",
    },
  ]

  // Set initial active index based on the selected vinyl from context
  useEffect(() => {
    if (selectedVinyl) {
      const index = vinylDesigns.findIndex((design) => design.id === selectedVinyl.id)
      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index)
      }
    }
  }, [selectedVinyl, vinylDesigns])

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
      setSelectedVinyl(newVinyl)
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
      setSelectedVinyl(newVinyl)
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
      setSelectedVinyl(newVinyl)
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

  // Call onSelectVinyl with the initial vinyl on first render
  useEffect(() => {
    if (onSelectVinyl && !isTransitioning) {
      const currentVinyl = vinylDesigns[activeIndex]
      onSelectVinyl(currentVinyl)
      setSelectedVinyl(currentVinyl)
    }
  }, [activeIndex, onSelectVinyl, isTransitioning])

  return (
    <div className="flex flex-col items-center">
      {/* Vinyl Record Container - ensures proper centering and containment */}
      <div className="flex justify-center items-center w-full mb-4">
        {/* Fixed size container to prevent layout shifts */}
        <div
          className="vinyl-container relative"
          style={{
            width: "300px",
            height: "300px",
            contain: "layout",
            overflow: "visible",
          }}
        >
          {/* Vinyl sizing wrapper with 3D perspective */}
          <div
            className="w-full h-full perspective-1000"
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
              onClick={nextVinyl} // Add onClick handler to trigger the next vinyl
            />
          </div>
        </div>
      </div>

      {/* Vinyl Selection Controls with fixed positioning */}
      <div className="flex flex-col items-center mt-2">
        {/* Title and Navigation Buttons with fixed width container */}
        <div className="relative flex items-center justify-center w-full mb-2">
          {/* Fixed width container for consistent layout */}
          <div className="w-64 h-10 flex items-center justify-between">
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
