"use client"

import { useState, useEffect } from "react"
import { VinylRecord } from "./vinyl-record"
import { useVinyl } from "@/contexts/vinyl-context"

export interface VinylDesign {
  id: string
  name: string
  labelColor: string
  faceType: string
  labelText: string
  description: string
  assistantType: string
}

export function VinylCollection() {
  const { selectedVinyl, setSelectedVinyl, vinylOptions, isLoading } = useVinyl()
  const [vinyls, setVinyls] = useState<VinylDesign[]>([])

  // Convert context vinyl options to vinyl designs
  useEffect(() => {
    if (vinylOptions.length > 0) {
      const vinylDesigns = vinylOptions.map((option) => ({
        id: option.id,
        name: option.name,
        labelColor: option.color.split(" ")[1] || "purple", // Extract color from gradient
        faceType: option.assistantType,
        labelText: `${option.name.toUpperCase()} • PREMIUM VINYL • AUDIOPHILE EDITION •`,
        description: option.description,
        assistantType: option.assistantType,
      }))
      setVinyls(vinylDesigns)
    }
  }, [vinylOptions])

  // Handle vinyl selection
  const handleVinylSelect = (vinyl: VinylDesign) => {
    // Find the corresponding option in vinylOptions
    const selectedOption = vinylOptions.find((option) => option.id === vinyl.id)
    if (selectedOption) {
      setSelectedVinyl(selectedOption)
    }
  }

  // Show loading state while fetching vinyl options
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {vinyls.map((vinyl) => (
        <div
          key={vinyl.id}
          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedVinyl?.id === vinyl.id ? "scale-105 ring-2 ring-purple-500 rounded-full" : ""
          }`}
          onClick={() => handleVinylSelect(vinyl)}
        >
          <VinylRecord
            labelColor={vinyl.labelColor}
            faceType={vinyl.faceType}
            labelText={vinyl.labelText}
            isPlaying={selectedVinyl?.id === vinyl.id}
            size={150}
          />
          <div className="text-center mt-2 font-medium">{vinyl.name}</div>
        </div>
      ))}
    </div>
  )
}
