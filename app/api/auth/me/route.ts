import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get the access token from cookies
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Fetch user profile from Spotify
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      // If token is invalid, return error
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: response.status })
    }

    // Return user profile
    const userData = await response.json()
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}
