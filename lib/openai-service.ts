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
