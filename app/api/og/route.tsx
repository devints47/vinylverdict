import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // Get the searchParams from the request URL
    const { searchParams } = new URL(request.url)

    // Get the roast text from the URL parameters
    let text = searchParams.get("text") || "Your music taste is... interesting."

    // Get the assistant type from the URL parameters (default to 'snob')
    const type = searchParams.get("type") || "snob"

    // Truncate text if it's too long (max ~300 chars for readability)
    if (text.length > 300) {
      text = text.substring(0, 297) + "..."
    }

    // Get title based on assistant type
    let title = "The Music Snob's Hot Take"
    if (type === "worshipper") {
      title = "The Taste Validator's Adoration"
    } else if (type === "historian") {
      title = "The Historian's Analysis"
    } else if (type === "therapist") {
      title = "The Melody Mystic's Divination"
    }

    // Get emoji based on assistant type
    let emoji = "🔥"
    if (type === "worshipper") {
      emoji = "✨"
    } else if (type === "historian") {
      emoji = "📚"
    } else if (type === "therapist") {
      emoji = "🔮"
    }

    // Get background gradient based on assistant type
    let gradient = "linear-gradient(to bottom right, #1e1e1e, #121212, #0a0a0a)"
    if (type === "worshipper") {
      gradient = "linear-gradient(to bottom right, #2d1b4e, #1e1e1e, #121212)"
    } else if (type === "historian") {
      gradient = "linear-gradient(to bottom right, #1e293b, #1e1e1e, #121212)"
    } else if (type === "therapist") {
      gradient = "linear-gradient(to bottom right, #c2410c, #1e1e1e, #121212)"
    }

    // Get the app URL from environment variable or use a default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinylverdict.fm"

    // Generate the image
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: gradient,
          padding: "40px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Abstract waveform background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2,
            zIndex: 0,
            backgroundImage: `url(${appUrl}/waveform-bg.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(5px)",
          }}
        />

        {/* Vinyl record decoration */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "#000",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 40px rgba(147, 51, 234, 0.3)",
            opacity: 0.6,
            zIndex: 1,
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            zIndex: 2,
            position: "relative",
          }}
        >
          {/* Title with emoji */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: 48, marginRight: "12px" }}>{emoji}</span>
            <h1
              style={{
                fontSize: 48,
                fontWeight: "bold",
                color: "white",
                margin: 0,
                background: "linear-gradient(to right, #9333ea, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </h1>
            <span style={{ fontSize: 48, marginLeft: "12px" }}>{emoji}</span>
          </div>

          {/* Roast text */}
          <div
            style={{
              fontSize: 32,
              fontWeight: "normal",
              color: "white",
              lineHeight: 1.4,
              marginBottom: "40px",
              maxWidth: "100%",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            {text}
          </div>

          {/* Footer with logo and text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "auto",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Logo placeholder - replace with actual logo */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(to right, #9333ea, #c084fc)",
                  marginRight: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🎵
              </div>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Powered by VinylVerdict.fm
              </span>
            </div>

            <div
              style={{
                fontSize: 18,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Get your own verdict at vinylverdict.fm
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response("Error generating image", { status: 500 })
  }
}
