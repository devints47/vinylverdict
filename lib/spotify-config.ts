// Spotify API configuration
export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ""
export const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || "https://www.vinylverdict.fm/callback"
export const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-top-read", // Required to read user's top items
]

// Make sure to always include user-top-read whenever authorizing users
export const SPOTIFY_SCOPE_STRING = SPOTIFY_SCOPES.join(" ")

// Spotify API endpoints
export const API_BASE_URL = "https://api.spotify.com/v1"
export const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
export const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"

// For debugging
console.log("SPOTIFY_CLIENT_ID:", SPOTIFY_CLIENT_ID)
console.log("SPOTIFY_REDIRECT_URI:", SPOTIFY_REDIRECT_URI)
