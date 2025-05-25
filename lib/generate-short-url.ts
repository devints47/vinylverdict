/**
 * Generates a short URL for sharing an image
 * @param imageUrl The URL of the image to share
 * @returns A shortened URL in the format https://vinylverdict.fm/s/{code}
 */
export function generateShortUrl(imageUrl: string): string {
  // Extract the blob ID from the Vercel blob URL
  // Example: https://ezh5wyf0kp4qar6y.public.blob.vercel-storage.com/vinyl-verdict-1748210529006.png
  // We want to extract: ezh5wyf0kp4qar6y and vinyl-verdict-1748210529006.png

  const urlParts = imageUrl.match(/https:\/\/([^.]+)\.public\.blob\.vercel-storage\.com\/(.+)/)

  if (!urlParts) {
    console.error("Invalid blob URL format:", imageUrl)
    // Fallback - this shouldn't happen with valid Vercel blob URLs
    throw new Error("Invalid blob URL format")
  }

  const [, blobId, filename] = urlParts

  // Create a much shorter data string: just blobId|filename (no timestamp)
  const data = `${blobId}|${filename}`

  // Encode as URL-safe base64
  const encoded = Buffer.from(data).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")

  // Get the base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinylverdict.fm"

  // Return the shortened URL
  return `${baseUrl}/s/${encoded}`
}
