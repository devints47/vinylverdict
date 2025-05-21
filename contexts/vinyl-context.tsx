"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the assistant type interface
export interface AssistantConfig {
  id: string
  name: string
  description: string
  color: string
  assistantType: string
}

// Create the context with a default value
interface VinylContextType {
  selectedVinyl: AssistantConfig | null
  setSelectedVinyl: (vinyl: AssistantConfig) => void
  vinylOptions: AssistantConfig[]
  isLoading: boolean
}

const VinylContext = createContext<VinylContextType>({
  selectedVinyl: null,
  setSelectedVinyl: () => {},
  vinylOptions: [],
  isLoading: true,
})

// Storage key for selected vinyl
const STORAGE_KEY = "vinylVerdict_selectedVinyl"

// Provider component
export function VinylProvider({ children }: { children: React.ReactNode }) {
  // State for vinyl options and selected vinyl
  const [vinylOptions, setVinylOptions] = useState<AssistantConfig[]>([])
  const [selectedVinyl, setSelectedVinylState] = useState<AssistantConfig | null>(null)
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
        const savedVinylId = localStorage.getItem(STORAGE_KEY)
        if (savedVinylId) {
          const savedVinyl = data.assistants.find((vinyl: AssistantConfig) => vinyl.id === savedVinylId)
          if (savedVinyl) {
            setSelectedVinylState(savedVinyl)
          } else {
            // If saved vinyl not found, use the first option
            setSelectedVinylState(data.assistants[0])
          }
        } else {
          // If no saved vinyl, use the first option
          setSelectedVinylState(data.assistants[0])
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching assistant configurations:", error)
        setIsLoading(false)
      }
    }

    fetchAssistantConfigs()
  }, [])

  // Custom setter that also saves to localStorage
  const setSelectedVinyl = (vinyl: AssistantConfig) => {
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

  return (
    <VinylContext.Provider value={{ selectedVinyl, setSelectedVinyl, vinylOptions, isLoading }}>
      {children}
    </VinylContext.Provider>
  )
}

// Custom hook to use the vinyl context
export function useVinyl() {
  return useContext(VinylContext)
}
