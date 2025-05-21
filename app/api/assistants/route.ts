import { NextResponse } from "next/server"

// Define assistant configurations using server-side environment variables
const assistantConfigs = [
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

export async function GET() {
  return NextResponse.json({ assistants: assistantConfigs })
}
