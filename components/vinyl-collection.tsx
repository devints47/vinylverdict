"use client"

import { useState, useEffect } from "react"
import { useVinyl } from "@/contexts/vinyl-context"
import { VinylRecord } from "./vinyl-record"

export interface VinylDesign {
  id: string
  name: string
  labelColor?: string
  faceType?: string
  labelText?: string
  description?: string
  assistantType: string
  color?: string
}

export function VinylCollection() {
  const { vinylOptions, selectedVinyl, setSelectedVinyl, isLoading } = useVinyl()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything during SSR or while loading
  if (!isClient || isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {vinylOptions.map((vinyl) => (
        <div
          key={vinyl.id}
          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedVinyl?.id === vinyl.id ? "scale-105 ring-2 ring-purple-500 rounded-lg" : ""
          }`}
          onClick={() => setSelectedVinyl(vinyl)}
        >
          <div className="flex flex-col items-center p-4 bg-zinc-900 rounded-lg">
            <VinylRecord
              size={150}
              labelColor={vinyl.labelColor || "purple"}
              faceType={vinyl.faceType || "default"}
              labelText={vinyl.labelText || "VINYL VERDICT • PREMIUM VINYL • AUDIOPHILE EDITION •"}
              isPlaying={selectedVinyl?.id === vinyl.id}
            />
            <h3 className="mt-4 text-xl font-bold bg-gradient-to-r text-transparent bg-clip-text from-purple-400 to-pink-600">
              {vinyl.name}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 text-center">{vinyl.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
