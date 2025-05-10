"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { VinylRecord } from "./vinyl-record"

// Define vinyl design type for better type safety
interface VinylDesign {
  id: string
  name: string
  labelColor: string
  faceType: "snob" | "happy" | "cool" | "surprised"
  labelText: string
}

export function VinylCollection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Define our vinyl designs
  const vinylDesigns: VinylDesign[] = [
    {
      id: "snob-classic",
      name: "The Critic",
      labelColor: "purple",
      faceType: "snob",
      labelText: "SNOBSCORE • PREMIUM VINYL • AUDIOPHILE EDITION •",
    },
    {
      id: "indie-vibes",
      name: "The Historian",
      labelColor: "teal",
      faceType: "cool",
      labelText: "INDIE • ALTERNATIVE • UNDERGROUND • EXCLUSIVE •",
    },
    {
      id: "pop-hits",
      name: "Pop Sensation",
      labelColor: "pink",
      faceType: "happy",
      labelText: "TOP CHARTS • DANCE HITS • PARTY ANTHEMS • REMIX •",
    },
    {
      id: "classic-rock",
      name: "Rock Legend",
      labelColor: "red",
      faceType: "surprised",
      labelText: "CLASSIC ROCK • GUITAR SOLOS • HEADBANGERS • LIVE •",
    },
    {
      id: "electronic",
      name: "Digital Wave",
      labelColor: "blue",
      faceType: "cool",
      labelText: "ELECTRONIC • SYNTH • BEATS • DIGITAL • FUTURE •",
    },
  ]

  // Navigation functions
  const nextVinyl = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex((prev) => (prev + 1) % vinylDesigns.length)
    setTimeout(() => setIsTransitioning(false), 500) // 500ms transition duration
  }

  const prevVinyl = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex((prev) => (prev - 1 + vinylDesigns.length) % vinylDesigns.length)
    setTimeout(() => setIsTransitioning(false), 500) // 500ms transition duration
  }

  const selectVinyl = (index: number) => {
    if (isTransitioning || index === activeIndex) return
    setIsTransitioning(true)
    setActiveIndex(index)
    setTimeout(() => setIsTransitioning(false), 500) // 500ms transition duration
  }

  return (
    <div className="flex flex-col items-center">
      {/* Vinyl Record Container - ensures proper centering */}
      <div className="flex justify-center items-center w-full mb-4">
        {/* Vinyl sizing wrapper */}
        <div
          className="relative transition-opacity duration-500"
          style={{
            maxWidth: "300px",
            opacity: isTransitioning ? 0.5 : 1,
          }}
        >
          <VinylRecord design={vinylDesigns[activeIndex]} key={vinylDesigns[activeIndex].id} />
        </div>
      </div>

      {/* Vinyl Selection Controls */}
      <div className="flex flex-col items-center mt-2">
        {/* Title and Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            onClick={prevVinyl}
            disabled={isTransitioning}
            className="bg-zinc-800/50 hover:bg-zinc-700/70 rounded-full p-2 transition-colors disabled:opacity-50"
            aria-label="Previous vinyl"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <h3 className="text-xl font-bold text-purple-gradient">{vinylDesigns[activeIndex].name}</h3>
          <button
            onClick={nextVinyl}
            disabled={isTransitioning}
            className="bg-zinc-800/50 hover:bg-zinc-700/70 rounded-full p-2 transition-colors disabled:opacity-50"
            aria-label="Next vinyl"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
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
