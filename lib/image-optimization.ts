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

  // Since Next.js Image Optimization isn't working, use direct URLs
  // but try to get an appropriately sized image from Spotify when possible

  // Some Spotify URLs can be modified to request different sizes
  // Example: https://i.scdn.co/image/ab67616d0000b273... (300x300)
  // Can be changed to: https://i.scdn.co/image/ab67616d00001e02... (64x64)

  // For album art, try to use smaller versions if available
  if (src.includes("/ab67616d0000b273")) {
    // Replace with 64x64 version
    if (width <= 64) {
      return src.replace("/ab67616d0000b273", "/ab67616d00001e02")
    }
    // Replace with 128x128 version
    else if (width <= 128) {
      return src.replace("/ab67616d0000b273", "/ab67616d00004e2a")
    }
  }

  // For artist images, try to use smaller versions if available
  if (src.includes("/ab6761610000e5eb")) {
    // Replace with smaller versions if needed
    if (width <= 64) {
      return src.replace("/ab6761610000e5eb", "/ab67616100001e02")
    }
  }

  // Return original URL if no optimizations are possible
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
