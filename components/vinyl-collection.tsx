"use client"

import { useState, useEffect, useRef } from "react"
import { VinylRecord } from "@/components/vinyl-record"
import { useVinyl, vinylOptions } from "@/contexts/vinyl-context"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface VinylDesign {
  id: string
  name: string
  description: string
  color: string
  assistantType: string
  labelColor?: string
}

interface VinylCollectionProps {
  onSelectVinyl?: (vinyl: VinylDesign) => void
}

export function VinylCollection({ onSelectVinyl }: VinylCollectionProps) {
  const { selectedVinyl, handleVinylSelect } = useVinyl()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    // Initial measurement
    updateWidth()

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateWidth)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Set initial index based on selected vinyl
  useEffect(() => {
    if (selectedVinyl) {
      const index = vinylOptions.findIndex((vinyl) => vinyl.id === selectedVinyl.id)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
  }, [selectedVinyl])

  const handlePrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const newIndex = (currentIndex - 1 + vinylOptions.length) % vinylOptions.length
    setCurrentIndex(newIndex)

    // Use the context's handleVinylSelect to update the selected vinyl
    const selectedVinyl = vinylOptions[newIndex]
    console.log("Previous clicked, selecting vinyl:", selectedVinyl)
    handleVinylSelect(selectedVinyl)

    // If onSelectVinyl prop is provided, call it too
    if (onSelectVinyl) {
      onSelectVinyl(selectedVinyl)
    }

    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const newIndex = (currentIndex + 1) % vinylOptions.length
    setCurrentIndex(newIndex)

    // Use the context's handleVinylSelect to update the selected vinyl
    const selectedVinyl = vinylOptions[newIndex]
    console.log("Next clicked, selecting vinyl:", selectedVinyl)
    handleVinylSelect(selectedVinyl)

    // If onSelectVinyl prop is provided, call it too
    if (onSelectVinyl) {
      onSelectVinyl(selectedVinyl)
    }

    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleDotClick = (index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    setCurrentIndex(index)

    // Use the context's handleVinylSelect to update the selected vinyl
    const selectedVinyl = vinylOptions[index]
    console.log("Dot clicked, selecting vinyl:", selectedVinyl)
    handleVinylSelect(selectedVinyl)

    // If onSelectVinyl prop is provided, call it too
    if (onSelectVinyl) {
      onSelectVinyl(selectedVinyl)
    }

    setTimeout(() => setIsAnimating(false), 500)
  }

  // Calculate vinyl size based on container width
  const vinylSize = Math.min(containerWidth * 0.8, 300)

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-full" ref={containerRef}>
        <div className="flex justify-center items-center relative">
          <button
            onClick={handlePrevious}
            className="absolute left-0 z-10 bg-zinc-900/50 hover:bg-zinc-800/70 rounded-full p-1 transition-colors"
            aria-label="Previous vinyl"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <div className="relative" style={{ width: `${vinylSize}px`, height: `${vinylSize}px` }}>
            <VinylRecord
              size={vinylSize}
              color={vinylOptions[currentIndex].color}
              labelColor={vinylOptions[currentIndex].labelColor || "purple"}
              isPlaying={false}
              className="transition-all duration-500"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 z-10 bg-zinc-900/50 hover:bg-zinc-800/70 rounded-full p-1 transition-colors"
            aria-label="Next vinyl"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-xl font-bold text-purple-gradient">{vinylOptions[currentIndex].name}</h3>
      </div>

      <div className="flex justify-center mt-2 space-x-2">
        {vinylOptions.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-purple-500" : "bg-zinc-600 hover:bg-zinc-500"
            }`}
            aria-label={`Select ${vinylOptions[index].name}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  )
}
