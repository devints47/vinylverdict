// OpenAI service - client side
// This file should NOT contain the API key

// Main function to get a roast based on user's music taste
export async function getRoast(data: any, viewType: string): Promise<string> {
  try {
    const response = await fetch("/api/roast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, viewType }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Append the disclaimer to the roast response
    const disclaimer =
      "\n\n<div class='text-xs text-center text-zinc-500 mt-4'>This roast is a satirical critique of your personal listening habits. It's all in good fun and not intended to insult any artists or fans.</div>"

    return result.roast + disclaimer
  } catch (error) {
    console.error("Error in getRoast:", error)
    return "Failed to generate a roast. Our critic is currently unavailable."
  }
}
