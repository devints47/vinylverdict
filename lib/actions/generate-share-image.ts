"use server"

/**
 * Server action to generate share image URL using POST request
 */
export async function generateShareImageUrl(text: string, assistantType: string): Promise<string> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const response = await fetch(`${appUrl}/api/share-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        type: assistantType,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`)
    }

    const blob = await response.blob()

    // Convert blob to base64 data URL for client-side usage
    const buffer = await blob.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const mimeType = blob.type || "image/png"

    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error("Error generating share image:", error)
    throw new Error("Failed to generate share image")
  }
}
