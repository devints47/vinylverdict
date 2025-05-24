"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the vinyl options with their properties
export const vinylOptions = [
  {
    id: "snob",
    name: "Music Snob",
    description:
      "The most discerning and judgmental of our critics. Music Snob has strong opinions about everything from production quality to lyrical depth. Prepare for a thorough dissection of your musical choices with zero mercy.",
    color: "from-red-500 to-orange-500",
    assistantType: "snob",
  },
  {
    id: "worshipper",
    name: "Taste Validator",
    description:
      "The ultimate music enthusiast who sees the beauty in every genre and artist. Taste Validator celebrates your musical journey with genuine excitement and positivity, finding the artistic merit in even your most questionable choices.",
    color: "from-green-400 to-emerald-500",
    assistantType: "worshipper",
  },
  {
    id: "historian",
    name: "Music Historian",
    description:
      "An ancient keeper of musical secrets who unveils the mysterious and forgotten lore behind your listening habits. The Historian analyzes your taste through an esoteric lens, revealing hidden connections and mythical knowledge about your musical journey.",
    color: "from-blue-400 to-indigo-500",
    assistantType: "historian",
  },
  // Pop Sensation and Rock Legend are hidden for now
  // {
  //   id: "pop-sensation",
  //   name: "Pop Sensation",
  //   description: "A chart-topping pop star who evaluates your music through the lens of commercial appeal and trend-setting potential.",
  //   color: "from-pink-400 to-purple-500",
  //   assistantType: "pop-sensation",
  // },
  // {
  //   id: "rock-legend",
  //   name: "Rock Legend",
  //   description: "A veteran rocker who's seen it all and judges your taste based on its raw energy, authenticity, and rebellious spirit.",
  //   color: "from-yellow-500 to-red-600",
  //   assistantType: "rock-legend",
  // },
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
        console.log("VinylContext - Loading from localStorage:", savedVinylId)
        if (savedVinylId) {
          // First try to find by assistantType (more reliable)
          let savedVinyl = vinylOptions.find((vinyl) => vinyl.assistantType === savedVinylId)

          // If not found, try by id (backward compatibility)
          if (!savedVinyl) {
            savedVinyl = vinylOptions.find((vinyl) => vinyl.id === savedVinylId)
          }

          if (savedVinyl) {
            console.log("VinylContext - Found saved vinyl:", savedVinyl)
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
    console.log("VinylContext - Setting selected vinyl:", vinyl)
    setSelectedVinylState(vinyl)

    // Save to localStorage - use assistantType as it's more reliable
    if (typeof window !== "undefined" && vinyl.assistantType) {
      try {
        localStorage.setItem(STORAGE_KEY, vinyl.assistantType)
        console.log("VinylContext - Saved to localStorage:", vinyl.assistantType)
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
