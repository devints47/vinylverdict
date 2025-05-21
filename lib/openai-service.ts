// OpenAI service - client side
// This file should NOT contain the API key

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
      const errorData = await response.json()
      console.warn(`API error! status: ${response.status}`, errorData)

      // If we have a fallback response from the server, use it
      if (errorData && errorData.fallback) {
        console.log("Using fallback response from server")
        return errorData.fallback
      }

      // Otherwise throw an error to be caught below
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Check if there was an error with the OpenAI API
    if (result.error) {
      console.warn(`OpenAI API error: ${result.error}`)

      // If we have a fallback, use it
      if (result.fallback) {
        return result.fallback
      }
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

    // Generate a fallback response based on the assistant type
    let fallbackMessage
    switch (assistantType) {
      case "worshipper":
        fallbackMessage =
          "# The Taste Validator's Adoration\n\nYour music taste is too magnificent for words right now. Our validator is currently overwhelmed by your exquisite selections. Please try again in a moment.\n\n*Note: The Taste Validator is currently composing a symphony inspired by your impeccable taste.*"
        break
      case "historian":
        fallbackMessage =
          "# The Historian's Analysis\n\nThe historical context of your music choices requires careful consideration. Our historian is currently deep in research. Please try again shortly.\n\n*Note: The Historian is currently researching obscure musical archives.*"
        break
      case "snob":
      default:
        fallbackMessage =
          "# The Music Snob's Hot Take\n\nEven your music choices couldn't crash our system this badly. Our snob is temporarily speechless. Please try again in a moment.\n\n*Note: The Music Snob is currently on a vinyl-shopping spree.*"
    }

    return (
      fallbackMessage +
      `\n\n<div class='text-xs text-center text-zinc-500 mt-4'>We're experiencing technical difficulties. Please try again later.</div>`
    )
  }
}
