// OpenAI service - client side
// This file should NOT contain the API key

// Function to poll for the run status
async function pollRunStatus(threadId: string, runId: string, maxAttempts = 30, interval = 1000): Promise<string> {
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const response = await fetch("/api/roast/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId, runId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // If the run is completed, return the roast
      if (result.status === "completed" && result.roast) {
        return result.roast
      }

      // If the run failed, throw an error
      if (result.status === "failed") {
        throw new Error(result.error || "Run failed")
      }

      // If the run is still in progress, wait and try again
      await new Promise((resolve) => setTimeout(resolve, interval))
      attempts++
    } catch (error) {
      console.error("Error polling run status:", error)
      throw error
    }
  }

  throw new Error("Timed out waiting for response")
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
      throw new Error(result.error)
    }

    // If we have thread and run IDs, poll for the completed response
    if (result.threadId && result.runId) {
      console.log(`Polling for run status: thread=${result.threadId}, run=${result.runId}`)
      const roastContent = await pollRunStatus(result.threadId, result.runId)

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

      return roastContent + disclaimer
    }

    // If we don't have thread and run IDs, return an error
    throw new Error("Missing thread or run IDs in response")
  } catch (error) {
    console.error("Error in getRoast:", error)
    return "Failed to generate analysis. Our music personality is currently unavailable."
  }
}
