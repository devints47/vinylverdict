import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get the access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value
    const expiryTimeStr = cookieStore.get("spotify_token_expiry")?.value

    // Check if token exists
    if (!accessToken) {
      return NextResponse.json({ isValid: false, reason: "no_token" })
    }

    // Check if token is expired
    if (expiryTimeStr) {
      const expiryTime = Number.parseInt(expiryTimeStr, 10)
      const now = Date.now()

      if (now >= expiryTime) {
        return NextResponse.json({ isValid: false, reason: "expired" })
      }
    }

    // Validate token with Spotify API
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // Return validation result
    return NextResponse.json({
      isValid: response.ok,
      reason: response.ok ? null : "invalid",
    })
  } catch (error) {
    console.error("Error validating token:", error)
    return NextResponse.json({ error: "Failed to validate token", isValid: false }, { status: 500 })
  }
}
