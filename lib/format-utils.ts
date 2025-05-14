// Helper functions to format data for the OpenAI API

// Format track data to a clean structure
export function formatTrackData(tracks: any[] | undefined) {
  if (!tracks || !Array.isArray(tracks)) {
    return []
  }

  return tracks.map((track) => ({
    artist: track.artists.map((a: any) => a.name).join(", "),
    song: track.name,
  }))
}

// Format artist data to a clean structure
export function formatArtistData(artists: any[] | undefined) {
  if (!artists || !Array.isArray(artists)) {
    return []
  }

  // For artists, we only return the artist names
  return artists.map((artist) => ({
    artist: artist.name,
  }))
}

// Format recently played data
export function formatRecentlyPlayedData(recentItems: any) {
  if (!recentItems || !recentItems.items || !Array.isArray(recentItems.items)) {
    return []
  }

  return recentItems.items.map((item: any) => ({
    artist: item.track.artists.map((a: any) => a.name).join(", "),
    song: item.track.name,
  }))
}

// Create a data object for the OpenAI API
export function createRoastData(data: any, viewType: string, timeRange?: string) {
  // Format the timeframe based on viewType and timeRange
  let timeframe = ""

  if (viewType === "recently played") {
    timeframe = "Recently played"
  } else if (viewType === "top tracks") {
    timeframe = `Top Tracks - ${timeRange || "All Time"}`
  } else if (viewType === "top artists") {
    timeframe = `Top Artists - ${timeRange || "All Time"}`
  }

  return {
    listening_history: data,
    timeframe: timeframe,
  }
}
