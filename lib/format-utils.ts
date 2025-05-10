// Helper functions to format data for the OpenAI API

// Format track data to a clean structure
export function formatTrackData(tracks: any[] | undefined) {
  if (!tracks || !Array.isArray(tracks)) {
    return []
  }

  return tracks.slice(0, 10).map((track) => ({
    title: track.name,
    artist: track.artists.map((a: any) => a.name).join(", "),
    album: track.album?.name || "",
  }))
}

// Format artist data to a clean structure
export function formatArtistData(artists: any[] | undefined) {
  if (!artists || !Array.isArray(artists)) {
    return []
  }

  return artists.slice(0, 10).map((artist) => ({
    name: artist.name,
    genres: artist.genres.slice(0, 3),
    popularity: artist.popularity,
  }))
}

// Format recently played data
export function formatRecentlyPlayedData(recentItems: any) {
  if (!recentItems || !recentItems.items || !Array.isArray(recentItems.items)) {
    return []
  }

  return recentItems.items.slice(0, 10).map((item: any) => ({
    title: item.track.name,
    artist: item.track.artists.map((a: any) => a.name).join(", "),
    album: item.track.album?.name || "",
    played_at: new Date(item.played_at).toLocaleString(),
  }))
}

// Create a descriptive prompt based on the current view
export function createRoastPrompt(data: any, viewType: string) {
  let prompt = `You are The Music Snob, a pretentious music critic with strong opinions and a sarcastic wit. Roast this person's ${viewType}:\n\n`

  if (viewType === "top tracks") {
    prompt += `Here are their top tracks:\n${JSON.stringify(data, null, 2)}\n\n`
    prompt +=
      "What does this selection of top tracks say about their music taste? Be creative, funny, and a bit mean, but not too offensive. Format your response with Markdown. Sign off as 'The Music Snob' at the end."
  } else if (viewType === "top artists") {
    prompt += `Here are their top artists:\n${JSON.stringify(data, null, 2)}\n\n`
    prompt +=
      "What does this selection of top artists say about their music taste? Be creative, funny, and a bit mean, but not too offensive. Format your response with Markdown. Sign off as 'The Music Snob' at the end."
  } else if (viewType === "recently played") {
    prompt += `Here are their recently played tracks:\n${JSON.stringify(data, null, 2)}\n\n`
    prompt +=
      "What does their recent listening history say about their current mood and music taste? Be creative, funny, and a bit mean, but not too offensive. Format your response with Markdown. Sign off as 'The Music Snob' at the end."
  }

  return prompt
}
