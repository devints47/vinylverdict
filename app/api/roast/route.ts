import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { checkAuth } from "@/lib/server-auth-utils" // Updated import

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
    console.log("Roast API called")

    // Check authentication
    const authResult = await checkAuth(request)
    if (!authResult.isAuthenticated) {
      console.error("Authentication failed:", authResult.error)
      return NextResponse.json({ error: "Unauthorized", details: authResult.error }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { data, viewType, assistantType = "snob" } = body

    console.log(`Processing request for assistant type: ${assistantType}, view type: ${viewType}`)

    // Get the assistant ID based on the type
    const assistantId = getAssistantId(assistantType)

    if (!assistantId) {
      console.error(`Assistant type "${assistantType}" not found or not configured`)
      return NextResponse.json(
        { error: `Assistant type "${assistantType}" not found or not configured` },
        { status: 400 },
      )
    }

    console.log(`Using assistant ID: ${assistantId.substring(0, 5)}...`)

    try {
      // Create a thread
      const thread = await openai.beta.threads.create()
      console.log(`Thread created: ${thread.id.substring(0, 5)}...`)

      // Add a message to the thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: JSON.stringify({ data, viewType }),
      })
      console.log("Message added to thread")

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      })
      console.log(`Run created: ${run.id.substring(0, 5)}...`)

      // Return the thread and run IDs
      return NextResponse.json({
        threadId: thread.id,
        runId: run.id,
      })
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError)

      // Check for specific OpenAI error types
      if (openaiError.status === 401) {
        return NextResponse.json(
          {
            error: "OpenAI API key is invalid",
            details: openaiError.message,
            fallback: generateFallbackResponse(data, viewType, assistantType),
          },
          { status: 500 },
        )
      }

      if (openaiError.status === 429) {
        return NextResponse.json(
          {
            error: "OpenAI API rate limit exceeded",
            details: openaiError.message,
            fallback: generateFallbackResponse(data, viewType, assistantType),
          },
          { status: 500 },
        )
      }

      // Return a fallback response for any OpenAI error
      return NextResponse.json(
        {
          error: "OpenAI API error",
          details: openaiError.message,
          fallback: generateFallbackResponse(data, viewType, assistantType),
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error in roast API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        fallback: "Our music critics are currently on break. Please try again later.",
      },
      { status: 500 },
    )
  }
}
