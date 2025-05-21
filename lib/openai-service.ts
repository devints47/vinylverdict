// API service for OpenAI interactions
export async function getRoast(data: any, viewType: string, assistantType = "snob") {
  try {
    const response = await fetch("/api/roast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        viewType,
        assistantType,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get roast: ${response.status}`)
    }

    const result = await response.json()
    return result.roast
  } catch (error) {
    console.error("Error in getRoast:", error)
    throw error
  }
}
