import { NextResponse } from "next/server"

// This endpoint provides assistant configurations without exposing the actual IDs
export async function GET() {
  // Map assistant types to their IDs from environment variables
  const assistantMap = {
    snob: process.env.OPENAI_MUSIC_SNOB_ID,
    worshipper: process.env.OPENAI_TASTE_VALIDATOR_ID,
    historian: process.env.OPENAI_HISTORIAN_ID,
  }

  // Return the assistant map with types as keys
  return NextResponse.json({
    success: true,
    assistants: assistantMap,
  })
}
