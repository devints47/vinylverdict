import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

// Set cache control headers
const cacheControl = {
  "content-type": "image/png",
  "cache-control": "public, max-age=60, s-maxage=60",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: cacheControl,
  })
}

export async function GET(request: NextRequest) {
  try {
    // Get the searchParams from the request URL
    const { searchParams } = new URL(request.url)

    // Get the roast text from the URL parameters
    let text = searchParams.get("text") || "Your music taste is... interesting."

    // Get the assistant type from the URL parameters (default to 'snob')
    const type = searchParams.get("type") || "snob"

    // Truncate text if it's too long for Stories format
    if (text.length > 200) {
      text = text.substring(0, 197) + "..."
    }

    // Get title based on assistant type
    let title = "Music Snob's Take"
    if (type === "worshipper") {
      title = "Taste Validator"
    } else if (type === "historian") {
      title = "Music Historian"
    } else if (type === "therapist") {
      title = "Armchair Therapist"
    }

    // Get background color based on assistant type
    let bgColor = "#121212"
    if (type === "worshipper") {
      bgColor = "#2d1b4e"
    } else if (type === "historian") {
      bgColor = "#1e293b"
    } else if (type === "therapist") {
      bgColor = "#c2410c"
    }

    // Create a simpler image with fewer nested elements
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: bgColor,
          padding: "80px 40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#9333ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              }}
            >
              🎵
            </div>
            <span
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              VinylVerdict.fm
            </span>
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#9333ea",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            {title}
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              color: "white",
              textAlign: "center",
              maxWidth: "100%",
              padding: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "16px",
              border: "1px solid rgba(147, 51, 234, 0.3)",
            }}
          >
            "{text}"
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              color: "white",
              textAlign: "center",
              padding: "16px 24px",
              backgroundColor: "rgba(147, 51, 234, 0.3)",
              borderRadius: "12px",
              border: "1px solid rgba(147, 51, 234, 0.5)",
            }}
          >
            Get your own verdict at vinylverdict.fm
          </div>
        </div>
      </div>,
      {
        width: 1080,
        height: 1920,
        headers: cacheControl,
      },
    )
  } catch (error) {
    console.error("Error generating simple story image:", error)
    return new Response(`Error generating image: ${error instanceof Error ? error.message : String(error)}`, {
      status: 500,
      headers: cacheControl,
    })
  }
}
