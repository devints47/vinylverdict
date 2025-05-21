import { NextResponse } from "next/server"
import { checkOpenAIAssistants } from "@/lib/env-check"

// Define the assistant types and their configurations
const assistantConfigs = [
  {
    id: "snob",
    name: "Music Snob",
    description: "A pretentious critic who will roast your music taste",
    color: "from-red-500 to-orange-500",
    assistantType: "snob",
    // The actual assistant ID is kept server-side
  },
  {
    id: "worshipper",
    name: "Taste Validator",
    description: "A supportive fan who will validate your music choices",
    color: "from-green-400 to-emerald-500",
    assistantType: "worshipper",
    // The actual assistant ID is kept server-side
  },
  {
    id: "historian",
    name: "Music Historian",
    description: "An academic who will analyze your music in historical context",
    color: "from-blue-400 to-indigo-500",
    assistantType: "historian",
    // The actual assistant ID is kept server-side
  },
]

// Check if we have valid assistant IDs
const hasValidAssistants = checkOpenAIAssistants()

export async function GET() {
  // Return the assistant configurations without exposing the actual IDs
  return NextResponse.json({
    assistants: assistantConfigs,
    hasValidAssistants,
  })
}
