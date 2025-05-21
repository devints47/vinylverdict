"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the vinyl design type
export interface VinylDesign {
  id: string
  name: string
  labelColor: string
  faceType: "snob" | "happy" | "cool" | "surprised"
  labelText: string
  description: string
  assistantType?: string
}

// Define the vinyl designs
export const vinylDesigns: VinylDesign[] = [
  {
    id: "music-snob",
    name: "Music Snob",
    labelColor: "purple",
    faceType: "snob",
    labelText: "VINYLVERDICT • PREMIUM VINYL • AUDIOPHILE EDITION •",
    description:
      "The most discerning and judgmental of our critics. Music Snob has strong opinions about everything from production quality to lyrical depth. Prepare for a thorough dissection of your musical choices with zero mercy.",
    assistantType: "snob",
  },
  {
    id: "taste-validator",
    name: "Taste Validator",
    labelColor: "teal",
    faceType: "happy",
    labelText: "VALIDATION • APPRECIATION • AFFIRMATION • PRAISE •",
    description:
      "The ultimate music enthusiast who sees the beauty in every genre and artist. Taste Validator celebrates your musical journey with genuine excitement and positivity, finding the artistic merit in even your most questionable choices.",
    assistantType: "worshipper",
  },
  {
    id: "indie-vibes",
    name: "The Historian",
    labelColor: "blue",
    faceType: "cool",
    labelText: "INDIE • ALTERNATIVE • UNDERGROUND • EXCLUSIVE •",
    description:
      "An ancient keeper of musical secrets who unveils the mysterious and forgotten lore behind your listening habits. The Historian analyzes your taste through an esoteric lens, revealing hidden connections and mythical knowledge about your musical journey.",
    assistantType: "historian",
  },
  // Pop Sensation and Rock Legend are commented out for now
  // {
  //   id: "pop-hits",
  //   name: "Pop Sensation",
  //   labelColor: "pink",
  //   faceType: "happy",
  //   labelText: "TOP CHARTS • DANCE HITS • PARTY ANTHEMS • REMIX •",
  //   description:
  //     "Enthusiastic about all things mainstream and catchy. Pop Sensation judges your playlist based on its danceability, chart performance, and viral potential. Expects maximum energy and hooks.",
  //   assistantType: "pop-sensation",
  // },
  // {
  //   id: "classic-rock",
  //   name: "Rock Legend",
  //   labelColor: "red",
  //   faceType: "surprised",
  //   labelText: "CLASSIC ROCK • GUITAR SOLOS • HEADBANGERS • LIVE •",
  //   description:
  //     "A true believer in the power of electric guitars and drum solos. Rock Legend evaluates your music based on its raw energy, instrumental prowess, and authenticity. Expects music that makes you want to headbang.",
  //   assistantType: "rock-legend",
  // },
]

// Define the context type
interface VinylContextType {
  selectedVinyl: VinylDesign
  setSelectedVinyl: (vinyl: VinylDesign) => void
  vinylDesigns: VinylDesign[]
  handleVinylSelect?: (vinyl: VinylDesign) => void
}

// Create the context with a default value
const VinylContext = createContext<VinylContextType>({
  selectedVinyl: vinylDesigns[0],
  setSelectedVinyl: () => {},
  vinylDesigns: vinylDesigns,
  handleVinylSelect: undefined,
})

// Storage key for selected vinyl
const STORAGE_KEY = "vinylVerdict_selectedVinyl"

// Provider component
export function VinylProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with the first vinyl option
  const [selectedVinyl, setSelectedVinylState] = useState<VinylDesign>(vinylDesigns[0])

  // Load the selected vinyl from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedVinylId = localStorage.getItem(STORAGE_KEY)
        if (savedVinylId) {
          // First try to find by assistantType (more reliable)
          let savedVinyl = vinylDesigns.find((vinyl) => vinyl.assistantType === savedVinylId)

          // If not found, try by id (backward compatibility)
          if (!savedVinyl) {
            savedVinyl = vinylDesigns.find((vinyl) => vinyl.id === savedVinylId)
          }

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
  const setSelectedVinyl = (vinyl: VinylDesign) => {
    setSelectedVinylState(vinyl)

    // Save to localStorage - use assistantType as it's more reliable
    if (typeof window !== "undefined" && vinyl.assistantType) {
      try {
        localStorage.setItem(STORAGE_KEY, vinyl.assistantType)
      } catch (err) {
        console.error("Error saving vinyl selection:", err)
      }
    }
  }

  // Handle vinyl selection (optional)
  const handleVinylSelect = (vinyl: VinylDesign) => {
    setSelectedVinyl(vinyl)
  }

  return (
    <VinylContext.Provider value={{ selectedVinyl, setSelectedVinyl, vinylDesigns, handleVinylSelect }}>
      {children}
    </VinylContext.Provider>
  )
}

// Custom hook to use the vinyl context
export function useVinyl() {
  return useContext(VinylContext)
}
