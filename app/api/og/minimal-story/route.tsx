import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let text = searchParams.get("text") || "Your music taste is... interesting."
    const type = searchParams.get("type") || "snob"

    // Truncate text
    if (text.length > 150) {
      text = text.substring(0, 147) + "..."
    }

    // Get title and color based on type
    let title = "Music Snob's Take"
    let bgColor = "#1a1a1a"
    let accentColor = "#9333ea"

    if (type === "worshipper") {
      title = "Taste Validator"
      bgColor = "#2d1b4e"
      accentColor = "#c084fc"
    } else if (type === "historian") {
      title = "Music Historian"
      bgColor = "#1e293b"
      accentColor = "#60a5fa"
    }

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: bgColor,
          padding: "60px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Header - single child, no display needed */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          VinylVerdict.fm
        </div>

        {/* Title - single child, no display needed */}
        <div
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: accentColor,
            textAlign: "center",
          }}
        >
          {title}
        </div>

        {/* Quote - single child, no display needed */}
        <div
          style={{
            fontSize: "32px",
            color: "white",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: "40px",
            borderRadius: "20px",
            border: `2px solid ${accentColor}`,
            maxWidth: "90%",
          }}
        >
          "{text}"
        </div>

        {/* Footer - single child, no display needed */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.8)",
            textAlign: "center",
          }}
        >
          Get your own verdict
        </div>
      </div>,
      {
        width: 1080,
        height: 1920,
        headers: {
          "content-type": "image/png",
          "cache-control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("Error in minimal-story:", error)
    return new Response("Error generating image", { status: 500 })
  }
}
