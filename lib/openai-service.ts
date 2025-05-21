// OpenAI service - client side
// This file should NOT contain the API key

import OpenAI from "openai"
import { checkRequiredEnvVars } from "./env-check"

// Check for required environment variables
checkRequiredEnvVars(["OPENAI_API_KEY"])

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Map assistant types to their IDs
const getAssistantId = (assistantType: string): string | undefined => {
  switch (assistantType) {
    case "snob":
      return process.env.OPENAI_MUSIC_SNOB_ID
    case "worshipper":
      return process.env.OPENAI_TASTE_VALIDATOR_ID
    case "historian":
      return process.env.OPENAI_HISTORIAN_ID
    default:
      return undefined
  }
}

// Main function to get a roast based on user's music taste
export async function getRoast(data: any, viewType: string, assistantType = "snob"): Promise<string> {
  try {
    // Log which assistant type is being used
    console.log(`Using assistant type: ${assistantType}`)

    const response = await fetch("/api/roast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, viewType, assistantType }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Check if there was an error with the OpenAI API
    if (result.error) {
      console.warn(`OpenAI API error: ${result.error}`)
    }

    // Get the appropriate disclaimer text based on assistant type
    let disclaimerText
    switch (assistantType) {
      case "worshipper":
        disclaimerText =
          "This validation is a celebration of your personal listening habits. It's all in good fun and meant to highlight the positive aspects of your music taste."
        break
      case "historian":
        disclaimerText =
          "This analysis examines your music in its historical and cultural context. It's meant to be educational and thought-provoking, not judgmental."
        break
      case "snob":
      default:
        disclaimerText =
          "This roast is a satirical critique of your personal listening habits. It's all in good fun and not intended to insult any artists or fans."
    }

    // Use a standardized disclaimer format for all assistant types
    const disclaimer = `\n\n<div class='text-xs text-center text-zinc-500 mt-4'>${disclaimerText}</div>`

    return result.roast + disclaimer
  } catch (error) {
    console.error("Error in getRoast:", error)
    return "Failed to generate analysis. Our music personality is currently unavailable."
  }
}

// Generate a roast based on the assistant type and data
export async function generateRoast(assistantType: string, data: any): Promise<string> {
  try {
    const assistantId = getAssistantId(assistantType)

    if (!assistantId) {
      throw new Error(`No assistant ID found for type: ${assistantType}`)
    }

    // Create a thread
    const thread = await openai.beta.threads.create()

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Here's my music data: ${JSON.stringify(data)}. Please roast my music taste.`,
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    })

    // Poll for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)

    while (runStatus.status !== "completed") {
      if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
        throw new Error(`Run failed with status: ${runStatus.status}`)
      }

      // Wait for a bit before polling again
      await new Promise((resolve) => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    }

    // Get the messages
    const messages = await openai.beta.threads.messages.list(thread.id)

    // Find the assistant's response
    const assistantMessages = messages.data.filter((msg) => msg.role === "assistant")

    if (assistantMessages.length === 0) {
      throw new Error("No assistant response found")
    }

    // Get the content of the last message
    const lastMessage = assistantMessages[0]
    const content = lastMessage.content[0]

    if (content.type !== "text") {
      throw new Error("Expected text content")
    }

    return content.text.value
  } catch (error) {
    console.error("Error generating roast:", error)
    return "Sorry, I couldn't generate a roast at this time. Please try again later."
  }
}
