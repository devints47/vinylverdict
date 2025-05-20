/**
 * Utility functions for image optimization - TESTING VERSION
 * This version forces Next.js Image Optimization with no fallbacks
 */

/**
 * Transforms a Spotify image URL to use WebP format via Next.js Image Optimization
 * This complies with Spotify guidelines as it only converts the format without modifying content
 *
 * @param src Original Spotify image URL
 * @param width Desired width (maintains aspect ratio)
 * @returns Optimized image URL
 */
export function getOptimizedSpotifyImage(src: string, width = 300): string {
  // If not a Spotify image, return as is
  if (!src || (!src.includes("scdn.co") && !src.includes("spotify.com"))) {
    console.log("Not a Spotify image, using original:", src)
    return src
  }

  // Create a URL object to properly encode the source URL
  const encodedSrc = encodeURIComponent(src)

  // Force using Next.js Image Optimization - no fallbacks
  const optimizedUrl = `/_next/image?url=${encodedSrc}&w=${width}&q=75&f=webp`

  // Log for debugging
  console.log("Original image:", src)
  console.log("Optimized image:", optimizedUrl)

  return optimizedUrl
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
