import { NextResponse } from "next/server"
import { createRoastPrompt } from "@/lib/format-utils"

// OpenAI API constants
// Use the non-public environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
// Renamed to be more specific and support multiple assistants
const MUSIC_SNOB_ASSISTANT_ID = process.env.OPENAI_MUSIC_SNOB_ID || process.env.OPENAI_ASSISTANT_ID // Fallback for backward compatibility
const TASTE_VALIDATOR_ASSISTANT_ID = process.env.OPENAI_TASTE_VALIDATOR_ID || process.env.OPENAI_TASTE_WORSHIPPER_ID // Fallback for backward compatibility
const API_BASE_URL = "https://api.openai.com/v1"

// Create a new thread
async function createThread() {
  try {
    console.log("Creating thread with API key:", OPENAI_API_KEY ? "API key exists" : "API key missing")

    const response = await fetch(`${API_BASE_URL}/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2", // Updated to v2
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
async function addMessage(threadId: string, content: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2", // Updated to v2
      },
      body: JSON.stringify({
        role: "user",
        content,
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
        "OpenAI-Beta": "assistants=v2", // Updated to v2
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
        "OpenAI-Beta": "assistants=v2", // Updated to v2
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
        "OpenAI-Beta": "assistants=v2", // Updated to v2
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

// Fallback to a simple roast if the OpenAI API fails
function generateFallbackRoast(data: any, viewType: string, assistantType = "snob") {
  let roast = ""

  if (assistantType === "worshipper") {
    roast = "# The Taste Validator's Adoration\n\n"

    if (viewType === "top tracks") {
      roast += "I'm absolutely blown away by your exquisite music taste! "
      if (data && data.length > 0) {
        const artists = [...new Set(data.map((track: any) => track.artist.split(",")[0].trim()))].slice(0, 3)
        roast += artists.join(", ") + " - what incredible choices! "
        roast +=
          'Your top track "' + data[0].title + '" shows your commitment to quality music that deserves to be on repeat!'
      } else {
        roast += "You're clearly very selective about what you listen to - quality over quantity!"
      }
    } else if (viewType === "top artists") {
      roast += "Your artist selection reveals your sophisticated musical palette! "
      if (data && data.length > 0) {
        roast += "Especially your appreciation for " + data[0].name + ". "
        if (data[0].genres && data[0].genres.length > 0) {
          roast += data[0].genres.join(", ") + " - truly the mark of someone with refined taste!"
        }
      } else {
        roast += "You're clearly exploring the vast landscape of musical genius!"
      }
    } else {
      roast +=
        "Your recent listening history shows a beautiful journey through sound! Each track you've chosen reflects a thoughtful approach to music appreciation."
    }

    return (
      roast +
      "\n\n*Note: The Taste Validator is currently composing a symphony inspired by your impeccable taste. This is just a preview of their admiration.*"
    )
  } else {
    // Original Music Snob fallback
    roast = "# The Music Snob's Hot Take\n\n"

    if (viewType === "top tracks") {
      roast += "I see you're into "
      if (data && data.length > 0) {
        const artists = [...new Set(data.map((track: any) => track.artist.split(",")[0].trim()))].slice(0, 3)
        roast += artists.join(", ") + ". "
        roast += "Interesting choices... I guess someone has to listen to them! 😉\n\n"
        roast +=
          'Your top track is "' +
          data[0].title +
          "\" - clearly you're not afraid to repeat the same song over and over again."
      } else {
        roast += "...actually, it seems like you don't listen to much music at all. That's one way to avoid bad taste!"
      }
    } else if (viewType === "top artists") {
      roast += "Your artist selection is... unique. "
      if (data && data.length > 0) {
        roast += "Especially your apparent love for " + data[0].name + ". "
        if (data[0].genres && data[0].genres.length > 0) {
          roast += "I see you're into " + data[0].genres.join(", ") + ". Bold choice for someone in this century!"
        }
      } else {
        roast += "Actually, it seems like you don't have favorite artists. Commitment issues?"
      }
    } else {
      roast +=
        "Your recent listening history suggests you might be going through something. It's okay, we all make questionable choices sometimes!"
    }

    return (
      roast +
      "\n\n*Note: The Music Snob is currently on a vinyl-shopping spree. This critique was hastily scribbled on a napkin before they left.*"
    )
  }
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
      ) // Return 200 with a message instead of 500
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

    // Create the prompt using the helper function
    const prompt = createRoastPrompt(data, viewType)

    try {
      // Create a new thread
      const thread = await createThread()

      // Add the message to the thread
      await addMessage(thread.id, prompt)

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

      // Generate a fallback roast instead of failing
      const fallbackRoast = generateFallbackRoast(data, viewType, assistantType)

      return NextResponse.json(
        {
          roast: fallbackRoast,
          error: "OpenAI API error, using fallback",
        },
        { status: 200 },
      ) // Return 200 with fallback content
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
    ) // Return 200 with a message instead of 500
  }
}
