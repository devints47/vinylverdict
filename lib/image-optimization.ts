/**
 * Utility for optimizing Spotify images by using their built-in sizing capabilities
 */

/**
 * Gets an appropriately sized image URL from Spotify
 * This complies with Spotify guidelines as it only requests different sizes
 * that Spotify officially provides, without modifying the images
 *
 * @param src Original Spotify image URL
 * @param width Desired width (used to determine appropriate size)
 * @returns Optimized image URL
 */
export function getOptimizedSpotifyImage(src: string, width = 300): string {
  // If not a valid URL or not a Spotify image, return as is
  if (!src || (!src.includes("scdn.co") && !src.includes("spotify.com"))) {
    return src
  }

  // For album art, use appropriate size based on width
  if (src.includes("/ab67616d0000b273")) {
    // 300x300 album art
    // Use 64x64 version for small displays
    if (width <= 64) {
      return src.replace("/ab67616d0000b273", "/ab67616d00001e02")
    }
    // Use 128x128 version for medium displays
    else if (width <= 128) {
      return src.replace("/ab67616d0000b273", "/ab67616d00004e2a")
    }
  }

  // For artist images
  if (src.includes("/ab6761610000e5eb")) {
    // Large artist image
    // Use smaller version for small displays
    if (width <= 64) {
      return src.replace("/ab6761610000e5eb", "/ab67616100001e02")
    }
  }

  // Return original URL if no optimizations are possible
  return src
}
