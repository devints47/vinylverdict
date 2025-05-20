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

  // If we're in development or don't have the necessary environment variables, return original
  if (typeof window === "undefined" && !process.env.NEXT_PUBLIC_VERCEL_URL) {
    return src
  }

  try {
    // Create a URL object to properly encode the source URL
    const encodedSrc = encodeURIComponent(src)

    // Use absolute URL if we have NEXT_PUBLIC_VERCEL_URL
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      const protocol = process.env.NEXT_PUBLIC_VERCEL_URL.includes("localhost") ? "http" : "https"
      return `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}/_next/image?url=${encodedSrc}&w=${width}&q=75&f=webp`
    }

    // Otherwise use relative URL (works in browser context)
    return `/_next/image?url=${encodedSrc}&w=${width}&q=75&f=webp`
  } catch (error) {
    console.error("Error optimizing image:", error)
    return src // Fallback to original URL
  }
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
