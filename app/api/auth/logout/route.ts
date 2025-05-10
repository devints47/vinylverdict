import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Clear all auth cookies
    const cookieStore = cookies()
    cookieStore.delete("spotify_access_token")
    cookieStore.delete("spotify_refresh_token")
    cookieStore.delete("spotify_token_expiry")
    cookieStore.delete("spotify_code_verifier")
    cookieStore.delete("spotify_auth_state")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}
