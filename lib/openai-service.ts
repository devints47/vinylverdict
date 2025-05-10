// OpenAI service - client side
// This file should NOT contain the API key

// Main function to get a roast based on user's music taste
export async function getRoast(data: any, viewType: string) {
  try {
    const response = await fetch("/api/roast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        viewType,
      }),
    })

    // Even if the response is not OK, we'll try to parse it
    // as our API now returns 200 with error messages
    const result = await response.json()

    // If there's a roast, return it (might be a fallback)
    if (result.roast) {
      return result.roast
    }

    // If no roast but there's an error, throw it
    if (result.error) {
      throw new Error(result.error)
    }

    // Fallback message if something unexpected happens
    return "# Hmm, that's strange\n\nI couldn't analyze your music taste. Maybe your taste is so unique it defies analysis!"
  } catch (error) {
    console.error("Error getting roast:", error)
    throw error
  }
}
