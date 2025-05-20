/**
 * Utility functions for image optimization
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
    return src
  }

  // For local development or environments without image optimization
  if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_VERCEL_URL) {
    return src
  }

  // Create a URL object to properly encode the source URL
  const encodedSrc = encodeURIComponent(src)

  // Use Next.js Image Optimization API
  return `/_next/image?url=${encodedSrc}&w=${width}&q=75&f=webp`
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
