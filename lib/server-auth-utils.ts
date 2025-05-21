import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

// Check if the user is authenticated
export async function checkAuth(request: NextRequest) {
  try {
    // Get the access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      console.log("No access token found in cookies")
      return {
        isAuthenticated: false,
        error: "No access token found",
      }
    }

    // Verify the token is valid by making a request to Spotify
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        console.log(`Spotify API returned status: ${response.status}`)

        // If token is expired, we should handle refresh here
        if (response.status === 401) {
          // Try to refresh the token
          const refreshed = await refreshAccessToken()
          if (refreshed.success) {
            return { isAuthenticated: true }
          } else {
            return {
              isAuthenticated: false,
              error: "Token expired and refresh failed",
            }
          }
        }

        return {
          isAuthenticated: false,
          error: `Spotify API error: ${response.status}`,
        }
      }

      return { isAuthenticated: true }
    } catch (error: any) {
      console.error("Error verifying access token:", error)
      return {
        isAuthenticated: false,
        error: `Error verifying token: ${error.message}`,
      }
    }
  } catch (error: any) {
    console.error("Error in checkAuth:", error)
    return {
      isAuthenticated: false,
      error: `Authentication check failed: ${error.message}`,
    }
  }
}

// Refresh the access token
async function refreshAccessToken() {
  try {
    const cookieStore = cookies()
    const refreshToken = cookieStore.get("spotify_refresh_token")?.value

    if (!refreshToken) {
      console.log("No refresh token found")
      return { success: false, error: "No refresh token found" }
    }

    // Call your refresh token endpoint
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      console.log(`Refresh token request failed: ${response.status}`)
      return { success: false, error: `Refresh failed: ${response.status}` }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error refreshing token:", error)
    return { success: false, error: error.message }
  }
}

// Validate environment variables
export function validateEnvironment() {
  const requiredVars = [
    "NEXT_PUBLIC_SPOTIFY_CLIENT_ID",
    "NEXT_PUBLIC_REDIRECT_URI",
    "OPENAI_API_KEY",
    "OPENAI_MUSIC_SNOB_ID",
    "OPENAI_TASTE_VALIDATOR_ID",
    "OPENAI_HISTORIAN_ID",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return true
}
