// Time range types for top items
export type TimeRange = "short_term" | "medium_term" | "long_term"

/**
 * Fetch data from Spotify API via our server-side proxy
 */
export async function fetchFromSpotify(endpoint: string, options = {}) {
  try {
    // Use the server-side endpoint to proxy the request
    const response = await fetch(`/api/spotify${endpoint}`, options)

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching from Spotify API (${endpoint}):`, error)
    throw error
  }
}

/**
 * Get user's recently played tracks
 */
export async function getRecentlyPlayed(limit = 20) {
  return fetchFromSpotify(`/me/player/recently-played?limit=${limit}`)
}

/**
 * Get multiple artists by their IDs
 */
export async function getArtists(artistIds: string[]) {
  // Spotify API allows up to 50 IDs per request
  const ids = artistIds.slice(0, 50).join(",")
  return fetchFromSpotify(`/artists?ids=${ids}`)
}

/**
 * Get user's top tracks
 */
export async function getTopTracks(timeRange: TimeRange = "medium_term", limit = 20) {
  return fetchFromSpotify(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`)
}

/**
 * Get user's top artists
 */
export async function getTopArtists(timeRange: TimeRange = "medium_term", limit = 20) {
  return fetchFromSpotify(`/me/top/artists?time_range=${timeRange}&limit=${limit}`)
}

/**
 * Get user's top items (artists or tracks)
 */
export async function getTopItems(type: "artists" | "tracks", timeRange: string, limit = 20) {
  return fetchFromSpotify(`/me/top/${type}?time_range=${timeRange}&limit=${limit}`)
}

/**
 * Get user profile
 */
export async function getUserProfile() {
  return fetchFromSpotify("/me")
}

/**
 * Helper function to format duration in milliseconds to mm:ss
 */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/**
 * Helper function to format date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
