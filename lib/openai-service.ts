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
    const disclaimerText =
      assistantType === "worshipper"
        ? "This validation is a celebration of your personal listening habits. It's all in good fun and meant to highlight the positive aspects of your music taste."
        : "This roast is a satirical critique of your personal listening habits. It's all in good fun and not intended to insult any artists or fans."

    // Get the appropriate signature based on assistant type
    const signature =
      assistantType === "worshipper" ? "\n\nHumbly at your service and always in awe." : "\n\nThe Music Snob"

    // If the response already has a signature or disclaimer, return it as is
    if (
      result.roast.includes("The Music Snob") ||
      result.roast.includes("Humbly at your service") ||
      result.roast.includes("This roast is") ||
      result.roast.includes("This validation is")
    ) {
      return result.roast
    }

    // Otherwise, add the standard signature and disclaimer
    return result.roast + signature + "\n\n" + disclaimerText
  } catch (error) {
    console.error("Error in getRoast:", error)
    return "Failed to generate analysis. Our music personality is currently unavailable."
  }
}
