"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the vinyl design interface
export interface VinylDesign {
  id: string
  name: string
  description: string
  color: string
  assistantType: string
}

// Define the context type
interface VinylContextType {
  selectedVinyl: VinylDesign | null
  vinylOptions: VinylDesign[]
  handleVinylSelect: (vinyl: VinylDesign) => void
  isLoading: boolean
}

// Create the context with a default value
const VinylContext = createContext<VinylContextType>({
  selectedVinyl: null,
  vinylOptions: [],
  handleVinylSelect: () => {},
  isLoading: true,
})

// Storage key for selected vinyl
const STORAGE_KEY = "vinylVerdict_selectedVinyl"

// Provider component
export function VinylProvider({ children }: { children: React.ReactNode }) {
  // State for vinyl options and selected vinyl
  const [vinylOptions, setVinylOptions] = useState<VinylDesign[]>([])
  const [selectedVinyl, setSelectedVinyl] = useState<VinylDesign | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch assistant configurations from the server
  useEffect(() => {
    async function fetchAssistantConfigs() {
      try {
        const response = await fetch("/api/assistants")
        if (!response.ok) {
          throw new Error(`Failed to fetch assistant configurations: ${response.status}`)
        }
        const data = await response.json()
        setVinylOptions(data.assistants)

        // After getting the options, try to load the saved selection
        if (typeof window !== "undefined") {
          const savedVinylId = localStorage.getItem(STORAGE_KEY)
          if (savedVinylId) {
            const savedVinyl = data.assistants.find((vinyl: VinylDesign) => vinyl.id === savedVinylId)
            if (savedVinyl) {
              setSelectedVinyl(savedVinyl)
            } else {
              // If saved vinyl not found, use the first option
              setSelectedVinyl(data.assistants[0])
            }
          } else {
            // If no saved vinyl, use the first option
            setSelectedVinyl(data.assistants[0])
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching assistant configurations:", error)
        // Fallback to default if fetch fails
        setIsLoading(false)
      }
    }

    fetchAssistantConfigs()
  }, [])

  // Custom handler that also saves to localStorage
  const handleVinylSelect = (vinyl: VinylDesign) => {
    setSelectedVinyl(vinyl)

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, vinyl.id)
      } catch (err) {
        console.error("Error saving vinyl selection:", err)
      }
    }
  }

  return (
    <VinylContext.Provider value={{ selectedVinyl, vinylOptions, handleVinylSelect, isLoading }}>
      {children}
    </VinylContext.Provider>
  )
}

// Custom hook to use the vinyl context
export function useVinyl() {
  return useContext(VinylContext)
}
