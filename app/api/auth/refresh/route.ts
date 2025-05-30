import { type NextRequest, NextResponse } from "next/server"
import { SPOTIFY_CLIENT_ID, TOKEN_ENDPOINT } from "@/lib/spotify-config"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Get the refresh token from cookies
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("spotify_refresh_token")?.value

    if (!refreshToken) {
      console.error("No refresh token found in cookies")
      return NextResponse.json({ error: "No refresh token available" }, { status: 401 })
    }

    // Exchange the refresh token for a new access token
    const body = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    })

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Token refresh error:", errorData)

      // If we get a 400 or 401, the refresh token might be invalid
      if (response.status === 400 || response.status === 401) {
        // Clear all auth cookies
        cookieStore.delete("spotify_access_token")
        cookieStore.delete("spotify_refresh_token")
        cookieStore.delete("spotify_token_expiry")

        return NextResponse.json({ error: "Invalid refresh token", requiresLogin: true }, { status: 401 })
      }

      return NextResponse.json(
        { error: `Token refresh failed: ${JSON.stringify(errorData)}` },
        { status: response.status },
      )
    }

    const tokenData = await response.json()

    // Store new tokens in HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    }

    // Calculate expiry time (subtract 5 minutes for safety margin)
    const expiryTime = Date.now() + (tokenData.expires_in - 300) * 1000

    // Set cookies
    cookieStore.set("spotify_access_token", tokenData.access_token, {
      ...cookieOptions,
      maxAge: tokenData.expires_in - 300, // Expires_in minus 5 minutes in seconds
    })

    // If a new refresh token was provided, update it
    if (tokenData.refresh_token) {
      cookieStore.set("spotify_refresh_token", tokenData.refresh_token, {
        ...cookieOptions,
        // No maxAge for refresh token - it's a session cookie that expires when browser closes
      })
    }

    cookieStore.set("spotify_token_expiry", expiryTime.toString(), {
      ...cookieOptions,
      maxAge: tokenData.expires_in - 300,
    })

    // Return success to the client (but not the actual tokens)
    return NextResponse.json({
      success: true,
      expiresAt: new Date(expiryTime).toISOString(),
    })
  } catch (error) {
    console.error("Error refreshing token:", error)
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 })
  }
}
