/**
 * Generates a short URL for sharing an image
 * @param imageUrl The URL of the image to share
 * @returns A shortened URL in the format https://vinylverdict.fm/s/{code}
 */
export function generateShortUrl(imageUrl: string): string {
  // Create a string with timestamp and image URL
  const data = `${Date.now()}|${imageUrl}`

  // Encode as base64
  const encoded = Buffer.from(data).toString("base64")

  // Get the base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinylverdict.fm"

  // Return the shortened URL
  return `${baseUrl}/s/${encoded}`
}
