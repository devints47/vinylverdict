"use client"

import { useState, useEffect, useRef } from "react"
import { VinylRecord } from "./vinyl-record"
import { useVinyl, vinylOptions } from "@/contexts/vinyl-context"
import { useResizeObserver } from "@/hooks/use-resize-observer"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function VinylCollection() {
  const { selectedVinyl, setSelectedVinyl } = useVinyl()
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver(containerRef)
  const [isMobile, setIsMobile] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDescription, setShowDescription] = useState(true)

  // Find the index of the selected vinyl
  useEffect(() => {
    const index = vinylOptions.findIndex((vinyl) => vinyl.id === selectedVinyl.id)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  }, [selectedVinyl])

  // Check if we're on mobile
  useEffect(() => {
    if (width) {
      setIsMobile(width < 768)
    }
  }, [width])

  const handlePrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setShowDescription(false)

    // Wait for the fade out animation
    setTimeout(() => {
      const newIndex = (currentIndex - 1 + vinylOptions.length) % vinylOptions.length
      setCurrentIndex(newIndex)
      setSelectedVinyl(vinylOptions[newIndex])

      // Wait a bit before showing the description again
      setTimeout(() => {
        setShowDescription(true)
        setIsAnimating(false)
      }, 300)
    }, 300)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setShowDescription(false)

    // Wait for the fade out animation
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % vinylOptions.length
      setCurrentIndex(newIndex)
      setSelectedVinyl(vinylOptions[newIndex])

      // Wait a bit before showing the description again
      setTimeout(() => {
        setShowDescription(true)
        setIsAnimating(false)
      }, 300)
    }, 300)
  }

  const handleDotClick = (index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    setShowDescription(false)

    // Wait for the fade out animation
    setTimeout(() => {
      setCurrentIndex(index)
      setSelectedVinyl(vinylOptions[index])

      // Wait a bit before showing the description again
      setTimeout(() => {
        setShowDescription(true)
        setIsAnimating(false)
      }, 300)
    }, 300)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 p-4">
        <div className="relative flex-shrink-0">
          <VinylRecord
            color={selectedVinyl.color}
            size={isMobile ? 240 : 320}
            isPlaying={false}
            label={selectedVinyl.name}
          />
        </div>

        <div className="flex flex-col items-center md:items-start max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center md:text-left">
            {selectedVinyl.name}
          </h2>
          <div
            className={`transition-opacity duration-300 h-auto md:h-32 overflow-hidden ${
              showDescription ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-zinc-300 text-sm md:text-base text-center md:text-left">{selectedVinyl.description}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={handlePrevious}
          className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-2 transition-colors"
          aria-label="Previous vinyl"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex gap-2">
          {vinylOptions.map((vinyl, index) => (
            <button
              key={vinyl.id}
              onClick={() => handleDotClick(index)}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-purple-500" : "bg-zinc-600 hover:bg-zinc-500"
              }`}
              aria-label={`Select ${vinyl.name}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-2 transition-colors"
          aria-label="Next vinyl"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
