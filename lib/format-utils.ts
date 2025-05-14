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
export function createRoastData(data: any, viewType: string) {
  return {
    listening_history: data,
  }
}
