import { type NextRequest, NextResponse } from "next/server"
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, TOKEN_ENDPOINT } from "@/lib/spotify-config"
import { cookies } from "next/headers"

// Handle POST requests for token exchange
export async function POST(request: NextRequest) {
  try {
    // Get the authorization code from the request body
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 })
    }

    // Get the code verifier from the cookie
    const cookieStore = cookies()
    const codeVerifier = cookieStore.get("spotify_code_verifier")?.value

    if (!codeVerifier) {
      console.error("No code verifier found in cookies")
      return NextResponse.json({ error: "Authentication flow interrupted. Please try again." }, { status: 400 })
    }

    // Exchange the code for tokens
    const body = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_verifier: codeVerifier,
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
      console.error("Token exchange error:", errorData)
      return NextResponse.json(
        { error: `Token exchange failed: ${JSON.stringify(errorData)}` },
        { status: response.status },
      )
    }

    const tokenData = await response.json()

    // Store tokens in HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    }

    // Calculate expiry time (subtract 1 hour for safety margin)
    const expiryTime = Date.now() + (tokenData.expires_in - 3600) * 1000

    // Set cookies
    cookieStore.set("spotify_access_token", tokenData.access_token, {
      ...cookieOptions,
      maxAge: tokenData.expires_in - 3600, // Expires_in minus 1 hour in seconds
    })

    cookieStore.set("spotify_refresh_token", tokenData.refresh_token, {
      ...cookieOptions,
      // No maxAge for refresh token - it's a session cookie that expires when browser closes
    })

    cookieStore.set("spotify_token_expiry", expiryTime.toString(), {
      ...cookieOptions,
      maxAge: tokenData.expires_in - 3600,
    })

    // Clear the code verifier and state cookies as they're no longer needed
    cookieStore.delete("spotify_code_verifier")
    cookieStore.delete("spotify_auth_state")

    // Return success to the client (but not the actual tokens)
    return NextResponse.json({
      success: true,
      expiresAt: new Date(expiryTime).toISOString(),
    })
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)
    return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 })
  }
}

// Handle GET requests for token retrieval
export async function GET(request: NextRequest) {
  try {
    // Get the access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value
    const expiryTimeStr = cookieStore.get("spotify_token_expiry")?.value

    // Check if token exists
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if token is expired
    if (expiryTimeStr) {
      const expiryTime = Number.parseInt(expiryTimeStr, 10)
      const now = Date.now()

      if (now >= expiryTime) {
        // Token is expired, try to refresh it
        const refreshResponse = await fetch(new URL("/api/auth/refresh", request.url).toString(), {
          method: "POST",
        })

        if (!refreshResponse.ok) {
          return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 })
        }

        // Get the new access token
        const newAccessToken = cookieStore.get("spotify_access_token")?.value
        if (!newAccessToken) {
          return NextResponse.json({ error: "Failed to get new access token after refresh" }, { status: 401 })
        }

        // Return the new access token
        return NextResponse.json({ accessToken: newAccessToken })
      }
    }

    // Return the current access token
    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error("Error getting access token:", error)
    return NextResponse.json({ error: "Failed to get access token" }, { status: 500 })
  }
}
