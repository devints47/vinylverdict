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

    // Truncate text if it's too long for Stories format (max ~200 chars for better readability)
    if (text.length > 200) {
      text = text.substring(0, 197) + "..."
    }

    // Get title based on assistant type
    let title = "Music Snob's Take"
    if (type === "worshipper") {
      title = "Taste Validator"
    } else if (type === "historian") {
      title = "Music Historian"
    }

    // Get emoji based on assistant type
    let emoji = "🔥"
    if (type === "worshipper") {
      emoji = "✨"
    } else if (type === "historian") {
      emoji = "📚"
    }

    // Get background gradient based on assistant type
    let gradient = "linear-gradient(to bottom, #1e1e1e, #121212, #0a0a0a)"
    if (type === "worshipper") {
      gradient = "linear-gradient(to bottom, #2d1b4e, #1e1e1e, #121212)"
    } else if (type === "historian") {
      gradient = "linear-gradient(to bottom, #1e293b, #1e1e1e, #121212)"
    }

    // Get the app URL from environment variable or use a default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinylverdict.fm"

    // Generate the Stories image (1080x1920)
    const response = new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          background: gradient,
          padding: "80px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            zIndex: 0,
            backgroundImage: `url(${appUrl}/waveform-bg.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        />

        {/* Floating vinyl records */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "#000",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)",
            opacity: 0.4,
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "-50px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "#000",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)",
            opacity: 0.3,
            zIndex: 1,
          }}
        />

        {/* Header section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          {/* App logo/branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(to right, #9333ea, #c084fc)",
                marginRight: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
              }}
            >
              🎵
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: 1,
                }}
              >
                VinylVerdict
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 1,
                }}
              >
                .fm
              </span>
            </div>
          </div>

          {/* Title with emoji */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: 40, marginRight: "10px" }}>{emoji}</span>
            <h1
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "white",
                margin: 0,
                background: "linear-gradient(to right, #9333ea, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
              }}
            >
              {title}
            </h1>
            <span style={{ fontSize: 40, marginLeft: "10px" }}>{emoji}</span>
          </div>
        </div>

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            zIndex: 2,
            maxWidth: "100%",
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          {/* Roast text */}
          <div
            style={{
              fontSize: 28,
              fontWeight: "normal",
              color: "white",
              lineHeight: 1.3,
              textAlign: "center",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)",
              maxWidth: "100%",
              wordWrap: "break-word",
            }}
          >
            "{text}"
          </div>
        </div>

        {/* Footer section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          {/* Call to action */}
          <div
            style={{
              background: "rgba(147, 51, 234, 0.2)",
              border: "2px solid rgba(147, 51, 234, 0.5)",
              borderRadius: "20px",
              padding: "20px 30px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                marginBottom: "5px",
              }}
            >
              Get Your Own Verdict
            </div>
            <div
              style={{
                fontSize: 18,
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              vinylverdict.fm
            </div>
          </div>

          {/* Swipe up indicator */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: 0.6,
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "5px",
              }}
            >
              Swipe up to try it
            </div>
            <div
              style={{
                width: "30px",
                height: "3px",
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      </div>,
      {
        width: 1080,
        height: 1920,
        headers: cacheControl,
      },
    )

    return response
  } catch (error) {
    console.error("Error generating Instagram Stories image:", error)
    return new Response("Error generating image", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }
}
