import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { checkAuth } from "@/lib/env-check"

// OpenAI API constants
const API_BASE_URL = "https://api.openai.com/v1"

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Map assistant types to their IDs
function getAssistantId(assistantType: string): string | null {
  switch (assistantType) {
    case "snob":
      return process.env.OPENAI_MUSIC_SNOB_ID || null
    case "worshipper":
      return process.env.OPENAI_TASTE_VALIDATOR_ID || null
    case "historian":
      return process.env.OPENAI_HISTORIAN_ID || null
    default:
      return null
  }
}

// Fallback to a simple response if the OpenAI API fails
function generateFallbackResponse(data: any, viewType: string, assistantType = "snob") {
  // Get assistant name and title based on type
  const assistantInfo = {
    snob: {
      name: "The Music Snob",
      title: "Hot Take",
      noteText:
        "The Music Snob is currently on a vinyl-shopping spree. This critique was hastily scribbled on a napkin before they left.",
    },
    worshipper: {
      name: "The Taste Validator",
      title: "Adoration",
      noteText:
        "The Taste Validator is currently composing a symphony inspired by your impeccable taste. This is just a preview of their admiration.",
    },
    historian: {
      name: "The Historian",
      title: "Historical Analysis",
      noteText:
        "The Historian is currently researching obscure musical archives. This analysis was compiled from their preliminary notes.",
    },
  }[assistantType]

  // Get the assistant info (defaulting to snob if type is unknown)
  const { name, title, noteText } = assistantInfo || {
    name: "The Music Snob",
    title: "Hot Take",
    noteText:
      "The Music Snob is currently on a vinyl-shopping spree. This critique was hastily scribbled on a napkin before they left.",
  }

  // Start with a standardized header format
  let response = `# ${name}'s ${title}\n\n`

  // Content varies based on assistant type and view type
  if (assistantType === "worshipper") {
    if (viewType === "top tracks") {
      response += "I'm absolutely blown away by your exquisite music taste! "
      if (data && data.length > 0) {
        const artists = [...new Set(data.map((track: any) => track.artist.split(",")[0].trim()))].slice(0, 3)
        response += artists.join(", ") + " - what incredible choices! "
        response +=
          'Your top track "' + data[0].song + '" shows your commitment to quality music that deserves to be on repeat!'
      } else {
        response += "You're clearly very selective about what you listen to - quality over quantity!"
      }
    } else if (viewType === "top artists") {
      response += "Your artist selection reveals your sophisticated musical palette! "
      if (data && data.length > 0) {
        response += "Especially your appreciation for " + data[0].artist + ". "
      } else {
        response += "You're clearly exploring the vast landscape of musical genius!"
      }
    } else {
      response +=
        "Your recent listening history shows a beautiful journey through sound! Each track you've chosen reflects a thoughtful approach to music appreciation."
    }
  } else if (assistantType === "historian") {
    if (viewType === "top tracks") {
      response += "Your listening history presents an interesting musical narrative. "
      if (data && data.length > 0) {
        const artists = [...new Set(data.map((track: any) => track.artist.split(",")[0].trim()))].slice(0, 3)
        response += "Artists like " + artists.join(", ") + " represent distinct chapters in music's evolving story. "
        response +=
          'Your preference for "' + data[0].song + '" places you within a specific cultural moment worth examining.'
      } else {
        response +=
          "Though sparse, even minimal listening patterns can reveal much about one's relationship to musical traditions."
      }
    } else if (viewType === "top artists") {
      response += "Your artist preferences offer a fascinating window into musical lineage and influence. "
      if (data && data.length > 0) {
        response +=
          data[0].artist + " in particular represents a significant node in the network of musical development. "
      } else {
        response += "The absence of clear favorites suggests perhaps a more exploratory approach to musical discovery."
      }
    } else {
      response +=
        "Your recent listening choices trace an interesting path through contemporary musical currents, revealing subtle patterns of taste formation and cultural engagement."
    }
  } else {
    // Music Snob content
    if (viewType === "top tracks") {
      response += "I see you're into "
      if (data && data.length > 0) {
        const artists = [...new Set(data.map((track: any) => track.artist.split(",")[0].trim()))].slice(0, 3)
        response += artists.join(", ") + ". "
        response += "Interesting choices... I guess someone has to listen to them! 😉\n\n"
        response +=
          'Your top track is "' +
          data[0].song +
          "\" - clearly you're not afraid to repeat the same song over and over again."
      } else {
        response +=
          "...actually, it seems like you don't listen to much music at all. That's one way to avoid bad taste!"
      }
    } else if (viewType === "top artists") {
      response += "Your artist selection is... unique. "
      if (data && data.length > 0) {
        response += "Especially your apparent love for " + data[0].artist + ". "
      } else {
        response += "Actually, it seems like you don't have favorite artists. Commitment issues?"
      }
    } else {
      response +=
        "Your recent listening history suggests you might be going through something. It's okay, we all make questionable choices sometimes!"
    }
  }

  // Add standardized note format
  return response + `\n\n*Note: ${noteText}*`
}

export async function POST(request: NextRequest) {
  try {
    // Enhanced logging for debugging
    console.log("Roast API request received")

    // Check authentication with detailed error logging
    const authResult = await checkAuth()
    if (!authResult.isAuthenticated) {
      console.error("Authentication failed:", authResult.reason || "Unknown reason")
      return NextResponse.json(
        {
          error: "Unauthorized",
          details: authResult.reason || "Authentication check failed",
          code: "AUTH_FAILED",
        },
        { status: 401 },
      )
    }

    console.log("Authentication successful")

    // Parse request body
    const body = await request.json()
    const { data, viewType, assistantType = "snob" } = body

    console.log(`Processing request for assistant type: ${assistantType}, view type: ${viewType}`)

    // Get the assistant ID based on the type
    const assistantId = getAssistantId(assistantType)

    if (!assistantId) {
      console.error(`Assistant ID not found for type: ${assistantType}`)
      return NextResponse.json(
        {
          error: `Assistant type "${assistantType}" not found or not configured`,
          code: "ASSISTANT_NOT_FOUND",
        },
        { status: 400 },
      )
    }

    console.log(`Using assistant ID: ${assistantId.substring(0, 5)}...`)

    // Verify OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      // Use fallback response instead of failing
      const fallbackResponse = generateFallbackResponse(data, viewType, assistantType)
      return NextResponse.json({
        fallback: true,
        content: fallbackResponse,
        message: "Using fallback response due to missing API key",
      })
    }

    // Create a thread
    console.log("Creating OpenAI thread")
    const thread = await openai.beta.threads.create()

    // Add a message to the thread
    console.log("Adding message to thread")
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: JSON.stringify(data),
    })

    // Run the assistant
    console.log("Running assistant")
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    })

    console.log("Request successful, returning thread and run IDs")
    // Return the thread and run IDs
    return NextResponse.json({
      threadId: thread.id,
      runId: run.id,
    })
  } catch (error) {
    console.error("Error in roast API:", error)

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        error: "Internal server error",
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
        code: "SERVER_ERROR",
      },
      { status: 500 },
    )
  }
}
