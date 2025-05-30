import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/spotify-config"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleSpotifyRequest(request, params.path, "GET")
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleSpotifyRequest(request, params.path, "POST")
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleSpotifyRequest(request, params.path, "PUT")
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleSpotifyRequest(request, params.path, "DELETE")
}

async function handleSpotifyRequest(request: NextRequest, pathSegments: string[], method: string) {
  try {
    // Get the access token from cookies
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("spotify_access_token")?.value
    const expiryTimeStr = cookieStore.get("spotify_token_expiry")?.value

    // Check if token exists
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if token is expired and refresh if needed
    if (expiryTimeStr) {
      const expiryTime = Number.parseInt(expiryTimeStr, 10)
      const now = Date.now()

      if (now >= expiryTime) {
        console.log("Token expired, refreshing before Spotify API request")

        // Refresh the token
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
      }
    }

    // Construct the full Spotify API URL
    const path = pathSegments.join("/")
    const queryString = request.nextUrl.search || ""
    const url = `${API_BASE_URL}/${path}${queryString}`

    // Forward the request to Spotify API
    const requestInit: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }

    // Include body for POST, PUT requests
    if (method === "POST" || method === "PUT") {
      const contentType = request.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const body = await request.json()
        requestInit.body = JSON.stringify(body)
      } else {
        const body = await request.text()
        requestInit.body = body
      }
    }

    const response = await fetch(url, requestInit)

    // Handle response
    if (!response.ok) {
      // If token is invalid (401), we could try to refresh it here
      if (response.status === 401) {
        console.error("Spotify API returned 401 - token might be invalid")
        // For now, just return the error
      }

      const errorText = await response.text()
      return NextResponse.json({ error: `Spotify API error: ${errorText}` }, { status: response.status })
    }

    // Return the Spotify API response
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying Spotify API request:", error)
    return NextResponse.json({ error: "Failed to proxy Spotify API request" }, { status: 500 })
  }
}
