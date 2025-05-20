/**
 * Utility functions for image optimization
 */

/**
 * Gets the appropriate image URL for Spotify images
 * This complies with Spotify guidelines as it only uses direct URLs without modification
 *
 * @param src Original Spotify image URL
 * @param width Desired width (for future use if needed)
 * @returns Image URL
 */
export function getOptimizedSpotifyImage(src: string, width = 300): string {
  // If not a valid URL or not a Spotify image, return as is
  if (!src || (!src.includes("scdn.co") && !src.includes("spotify.com"))) {
    return src
  }

  // Just return the original URL - no optimization but guaranteed to work
  return src
}

/**
 * Checks if the browser supports WebP format
 * @returns Promise that resolves to boolean indicating WebP support
 */
export async function supportsWebP(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false
  }

  // Check for WebP support using feature detection
  const webpSupported = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0

  return webpSupported
}
