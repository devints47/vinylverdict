import { NextResponse } from "next/server"
import { createRoastData } from "@/lib/format-utils"
import { checkOpenAIAssistants } from "@/lib/env-check"

// OpenAI API constants
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const MUSIC_SNOB_ASSISTANT_ID = process.env.OPENAI_MUSIC_SNOB_ID
const TASTE_VALIDATOR_ASSISTANT_ID = process.env.OPENAI_TASTE_VALIDATOR_ID
const API_BASE_URL = "https://api.openai.com/v1"

// Check if we have valid assistant IDs
const hasValidAssistants = checkOpenAIAssistants()

// Create a new thread
async function createThread() {
  try {
    console.log("Creating thread with API key:", OPENAI_API_KEY ? "API key exists" : "API key missing")

    const response = await fetch(`${API_BASE_URL}/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Thread creation response:", response.status, errorData)
      throw new Error(`Failed to create thread: ${response.status} ${JSON.stringify(errorData)}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating thread:", error)
    throw error
  }
}

// Add a message to a thread
async function addMessage(threadId: string, content: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        role: "user",
        content: JSON.stringify(content),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to add message: ${response.status} ${JSON.stringify(errorData)}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding message:", error)
    throw error
  }
}

// Run the assistant on a thread
async function runAssistant(threadId: string, assistantId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to run assistant: ${response.status} ${JSON.stringify(errorData)}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error running assistant:", error)
    throw error
  }
}

// Check the status of a run
async function checkRunStatus(threadId: string, runId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}/runs/${runId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to check run status: ${response.status} ${JSON.stringify(errorData)}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error checking run status:", error)
    throw error
  }
}

// Get messages from a thread
async function getMessages(threadId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to get messages: ${response.status} ${JSON.stringify(errorData)}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting messages:", error)
    throw error
  }
}

// Helper function to wait for a run to complete
async function waitForRunCompletion(threadId: string, runId: string, maxAttempts = 60, delayMs = 1000) {
  let attempts = 0

  while (attempts < maxAttempts) {
    const runStatus = await checkRunStatus(threadId, runId)

    if (runStatus.status === "completed") {
      return runStatus
    }

    if (runStatus.status === "failed" || runStatus.status === "cancelled") {
      throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || "Unknown error"}`)
    }

    // Wait before checking again
    await new Promise((resolve) => setTimeout(resolve, delayMs))
    attempts++
  }

  throw new Error("Timed out waiting for run to complete")
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

export async function POST(request: Request) {
  try {
    // Check if API key exists
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      return NextResponse.json(
        {
          roast:
            "# Hmm, That's Awkward\n\nThe Music Snob seems to have dozed off while analyzing your questionable taste. Please try again later or play something better to wake them up.",
          error: "OpenAI API key is missing",
        },
        { status: 200 },
      )
    }

    const { data, viewType, assistantType = "snob" } = await request.json()

    // Determine which assistant ID to use
    let assistantId = MUSIC_SNOB_ASSISTANT_ID
    if (assistantType === "worshipper") {
      assistantId = TASTE_VALIDATOR_ASSISTANT_ID
    }

    // Check if Assistant ID exists
    if (!assistantId) {
      console.error(`OpenAI Assistant ID is missing for type: ${assistantType}`)
      return NextResponse.json(
        {
          roast:
            "# Where's The Music Snob?\n\nOur resident music personality seems to have gone missing. The management is currently trying to locate them, probably checking local record stores and coffee shops.",
          error: `OpenAI Assistant ID is missing for type: ${assistantType}`,
        },
        { status: 200 },
      )
    }

    // Create the data object using the helper function
    const messageData = createRoastData(data, viewType)

    try {
      // Create a new thread
      const thread = await createThread()

      // Add the message to the thread
      await addMessage(thread.id, messageData)

      // Run the assistant
      const run = await runAssistant(thread.id, assistantId)

      // Wait for the run to complete
      await waitForRunCompletion(thread.id, run.id)

      // Get the messages
      const messages = await getMessages(thread.id)

      // Find the assistant's response (should be the last message)
      const assistantMessages = messages.data.filter((msg: any) => msg.role === "assistant")

      if (assistantMessages.length === 0) {
        throw new Error("No response from assistant")
      }

      // Return the content of the last assistant message
      const roastContent = assistantMessages[0].content[0].text.value

      return NextResponse.json(
        { roast: roastContent },
        {
          headers: {
            "Cache-Control": "private, max-age=3600",
          },
        },
      )
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)

      // Generate a fallback response instead of failing
      const fallbackRoast = generateFallbackResponse(data, viewType, assistantType)

      return NextResponse.json(
        {
          roast: fallbackRoast,
          error: "OpenAI API error, using fallback",
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error in roast API:", error)
    return NextResponse.json(
      {
        roast:
          "# The Music Snob Is Speechless\n\nYour taste in music has rendered our resident critic temporarily unable to form coherent sentences. Either your taste is truly beyond critique, or it's so bad they're still processing it.",
        error: "Failed to generate roast",
      },
      { status: 200 },
    )
  }
}
