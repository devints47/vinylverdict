"use client"

import { useState, useEffect } from "react"
import { VinylRecord } from "@/components/vinyl-record"
import { useVinyl, type VinylDesign } from "@/contexts/vinyl-context"
import { Loader2 } from "lucide-react"

interface VinylCollectionProps {
  onSelectVinyl: (vinyl: VinylDesign) => void
}

export function VinylCollection({ onSelectVinyl }: VinylCollectionProps) {
  const { selectedVinyl, vinylOptions, handleVinylSelect, isLoading } = useVinyl()
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Update selected index when selectedVinyl changes
  useEffect(() => {
    if (selectedVinyl) {
      const index = vinylOptions.findIndex((vinyl) => vinyl.id === selectedVinyl.id)
      if (index !== -1) {
        setSelectedIndex(index)
      }
    }
  }, [selectedVinyl, vinylOptions])

  // Handle vinyl selection
  const handleSelect = (vinyl: VinylDesign, index: number) => {
    setSelectedIndex(index)
    handleVinylSelect(vinyl)
    if (onSelectVinyl) {
      onSelectVinyl(vinyl)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/50 rounded-xl border border-zinc-800">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-2" />
        <p className="text-zinc-400 text-sm">Loading personalities...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
      <h2 className="text-xl font-bold mb-4 text-center text-purple-gradient">Choose Your Critic</h2>
      <p className="text-zinc-400 text-sm mb-6 text-center">Select a personality to analyze your music taste</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {vinylOptions.map((vinyl, index) => (
          <div
            key={vinyl.id}
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
              selectedIndex === index ? "scale-105" : "scale-95 opacity-70 hover:opacity-90"
            }`}
            onClick={() => handleSelect(vinyl, index)}
          >
            <VinylRecord
              size={100}
              color={vinyl.color}
              isPlaying={selectedIndex === index}
              name={vinyl.name}
              className="mb-2"
            />
            <h3 className="text-sm font-medium text-center">{vinyl.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
