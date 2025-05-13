"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { VinylDesign } from "@/components/vinyl-collection"

interface VinylContextType {
  selectedVinyl: VinylDesign | null
  setSelectedVinyl: (vinyl: VinylDesign) => void
}

const VinylContext = createContext<VinylContextType | undefined>(undefined)

// Default vinyl design for Music Snob
const DEFAULT_VINYL: VinylDesign = {
  id: "music-snob",
  name: "Music Snob",
  labelColor: "purple",
  faceType: "snob",
  labelText: "SNOBSCORE • PREMIUM VINYL • AUDIOPHILE EDITION •",
  description:
    "The most discerning and judgmental of our critics. Music Snob has strong opinions about everything from production quality to lyrical depth. Prepare for a thorough dissection of your musical choices with zero mercy.",
  assistantType: "snob",
}

export function VinylProvider({ children }: { children: ReactNode }) {
  const [selectedVinyl, setSelectedVinylState] = useState<VinylDesign | null>(null)

  // Load the default vinyl on initial render
  useEffect(() => {
    setSelectedVinylState(DEFAULT_VINYL)
  }, [])

  // Save the selected vinyl to localStorage whenever it changes
  const setSelectedVinyl = (vinyl: VinylDesign) => {
    setSelectedVinylState(vinyl)
    // We're no longer saving to localStorage
    // if (typeof window !== "undefined") {
    //   localStorage.setItem("selectedVinyl", JSON.stringify(vinyl))
    // }
  }

  return <VinylContext.Provider value={{ selectedVinyl, setSelectedVinyl }}>{children}</VinylContext.Provider>
}

export function useVinyl() {
  const context = useContext(VinylContext)
  if (context === undefined) {
    throw new Error("useVinyl must be used within a VinylProvider")
  }
  return context
}
