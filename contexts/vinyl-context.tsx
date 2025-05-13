"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { VinylDesign } from "@/components/vinyl-collection"

interface VinylContextType {
  selectedVinyl: VinylDesign | null
  setSelectedVinyl: (vinyl: VinylDesign) => void
  handleVinylSelect: (vinyl: VinylDesign) => void
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

// Storage key for localStorage
const STORAGE_KEY = "snobify_selected_vinyl"

export function VinylProvider({ children }: { children: ReactNode }) {
  const [selectedVinyl, setSelectedVinylState] = useState<VinylDesign | null>(null)

  // Load the selected vinyl from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Try to get the saved vinyl from localStorage
        const savedVinyl = localStorage.getItem(STORAGE_KEY)

        if (savedVinyl) {
          // If we have a saved vinyl, parse and use it
          const parsedVinyl = JSON.parse(savedVinyl)
          setSelectedVinylState(parsedVinyl)
        } else {
          // Otherwise use the default vinyl
          setSelectedVinylState(DEFAULT_VINYL)
        }
      } catch (error) {
        // If there's any error (e.g., invalid JSON), use the default vinyl
        console.error("Error loading saved vinyl:", error)
        setSelectedVinylState(DEFAULT_VINYL)
      }
    }
  }, [])

  // Save the selected vinyl to localStorage whenever it changes
  const setSelectedVinyl = (vinyl: VinylDesign) => {
    setSelectedVinylState(vinyl)

    // Save to localStorage for persistence across page navigations
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vinyl))
    }
  }

  // Handler for vinyl selection (used in components)
  const handleVinylSelect = (vinyl: VinylDesign) => {
    setSelectedVinyl(vinyl)
  }

  return (
    <VinylContext.Provider value={{ selectedVinyl, setSelectedVinyl, handleVinylSelect }}>
      {children}
    </VinylContext.Provider>
  )
}

export function useVinyl() {
  const context = useContext(VinylContext)
  if (context === undefined) {
    throw new Error("useVinyl must be used within a VinylProvider")
  }
  return context
}
