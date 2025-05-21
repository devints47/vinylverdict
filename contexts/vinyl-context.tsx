"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the vinyl options with their properties
export const vinylOptions = [
  {
    id: "snob",
    name: "Music Snob",
    description: "A pretentious critic who will roast your music taste",
    color: "from-red-500 to-orange-500",
    assistantType: "snob",
  },
  {
    id: "worshipper",
    name: "Taste Validator",
    description: "A supportive fan who will validate your music choices",
    color: "from-green-400 to-emerald-500",
    assistantType: "worshipper",
  },
  {
    id: "historian",
    name: "Music Historian",
    description: "An academic who will analyze your music in historical context",
    color: "from-blue-400 to-indigo-500",
    assistantType: "historian",
  },
]

// Define the context type
interface VinylContextType {
  selectedVinyl: (typeof vinylOptions)[0]
  setSelectedVinyl: (vinyl: (typeof vinylOptions)[0]) => void
}

// Create the context with a default value
const VinylContext = createContext<VinylContextType>({
  selectedVinyl: vinylOptions[0],
  setSelectedVinyl: () => {},
})

// Storage key for selected vinyl
const STORAGE_KEY = "vinylVerdict_selectedVinyl"

// Provider component
export function VinylProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with the first vinyl option
  const [selectedVinyl, setSelectedVinylState] = useState<(typeof vinylOptions)[0]>(vinylOptions[0])

  // Load the selected vinyl from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedVinylId = localStorage.getItem(STORAGE_KEY)
        if (savedVinylId) {
          const savedVinyl = vinylOptions.find((vinyl) => vinyl.id === savedVinylId)
          if (savedVinyl) {
            setSelectedVinylState(savedVinyl)
          }
        }
      } catch (err) {
        console.error("Error loading saved vinyl:", err)
      }
    }
  }, [])

  // Custom setter that also saves to localStorage
  const setSelectedVinyl = (vinyl: (typeof vinylOptions)[0]) => {
    setSelectedVinylState(vinyl)

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, vinyl.id)
      } catch (err) {
        console.error("Error saving vinyl selection:", err)
      }
    }
  }

  return <VinylContext.Provider value={{ selectedVinyl, setSelectedVinyl }}>{children}</VinylContext.Provider>
}

// Custom hook to use the vinyl context
export function useVinyl() {
  return useContext(VinylContext)
}
