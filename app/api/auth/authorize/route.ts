import { type NextRequest, NextResponse } from "next/server"
import { AUTH_ENDPOINT, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPE_STRING } from "@/lib/spotify-config"
import { generateCodeVerifier, generateCodeChallenge } from "@/lib/server-auth-utils"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    console.log("Generating authorization URL...")
    console.log("Client ID:", SPOTIFY_CLIENT_ID)
    console.log("Redirect URI:", SPOTIFY_REDIRECT_URI)

    if (!SPOTIFY_CLIENT_ID) {
      console.error("Missing Spotify Client ID")
      return NextResponse.json({ error: "Missing Spotify Client ID" }, { status: 500 })
    }

    // Generate code verifier and challenge
    const codeVerifier = generateCodeVerifier(128)
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    // Generate state for CSRF protection
    const state = generateCodeVerifier(16)

    // Store code verifier and state in secure HTTP-only cookies
    const cookieStore = await cookies()

    // Set cookies with HTTP-only flag and short expiration (10 minutes)
    cookieStore.set("spotify_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
      sameSite: "lax",
    })

    cookieStore.set("spotify_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
      sameSite: "lax",
    })

    // Build the authorization URL
    const args = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      state: state,
      scope: SPOTIFY_SCOPE_STRING,
    })

    const authUrl = `${AUTH_ENDPOINT}?${args}`
    console.log("Auth URL generated:", authUrl)

    // Return the authorization URL and the code verifier/state for client-side fallback
    return NextResponse.json({
      authUrl,
      // Include these values for client-side fallback (for Safari iOS)
      codeVerifier,
      state,
    })
  } catch (error) {
    console.error("Error generating authorization URL:", error)
    return NextResponse.json({ error: "Failed to generate authorization URL" }, { status: 500 })
  }
}
