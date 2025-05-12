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

  // Load the selected vinyl from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVinyl = localStorage.getItem("selectedVinyl")
      if (savedVinyl) {
        try {
          setSelectedVinylState(JSON.parse(savedVinyl))
        } catch (e) {
          console.error("Error parsing saved vinyl:", e)
          setSelectedVinylState(DEFAULT_VINYL)
        }
      } else {
        setSelectedVinylState(DEFAULT_VINYL)
      }
    }
  }, [])

  // Save the selected vinyl to localStorage whenever it changes
  const setSelectedVinyl = (vinyl: VinylDesign) => {
    setSelectedVinylState(vinyl)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedVinyl", JSON.stringify(vinyl))
    }
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
