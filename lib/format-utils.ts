// Helper functions to format data for the OpenAI API

// Helper function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  if (!array || array.length === 0) return []
  if (array.length <= count) return array

  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Format track data to a clean structure
export function formatTrackData(tracks: any[] | undefined) {
  if (!tracks || !Array.isArray(tracks)) {
    return []
  }

  // Get 10 random tracks from the list
  const randomTracks = getRandomItems(tracks, 10)

  return randomTracks.map((track) => ({
    artist: track.artists.map((a: any) => a.name).join(", "),
    song: track.name,
  }))
}

// Format artist data to a clean structure
export function formatArtistData(artists: any[] | undefined) {
  if (!artists || !Array.isArray(artists)) {
    return []
  }

  // Get 10 random artists from the list
  const randomArtists = getRandomItems(artists, 10)

  // For artists, we only return the artist names
  return randomArtists.map((artist) => ({
    artist: artist.name,
  }))
}

// Format recently played data
export function formatRecentlyPlayedData(recentItems: any) {
  if (!recentItems || !recentItems.items || !Array.isArray(recentItems.items)) {
    return []
  }

  // Get 10 random items from recently played
  const randomItems = getRandomItems(recentItems.items, 10)

  return randomItems.map((item: any) => ({
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
