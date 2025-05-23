import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get("text") || "Your music taste is... interesting."
    const type = searchParams.get("type") || "snob"

    // Truncate text
    const truncatedText = text.length > 100 ? text.substring(0, 97) + "..." : text

    // Get color based on type
    let bgColor = "#1a1a1a"
    let accentColor = "#9333ea"

    if (type === "worshipper") {
      bgColor = "#2d1b4e"
      accentColor = "#c084fc"
    } else if (type === "historian") {
      bgColor = "#1e293b"
      accentColor = "#60a5fa"
    }

    // Create a single-element response
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: bgColor,
          padding: "40px",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div style={{ color: "white", fontSize: "48px" }}>VinylVerdict.fm</div>
          <div style={{ color: accentColor, fontSize: "36px" }}>
            {type === "snob" ? "Music Snob's Take" : type === "worshipper" ? "Taste Validator" : "Music Historian"}
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "800px",
            }}
          >
            "{truncatedText}"
          </div>
        </div>
      </div>,
      {
        width: 1080,
        height: 1920,
        headers: {
          "content-type": "image/png",
          "cache-control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("Error in ultra-minimal:", error)
    return new Response("Error generating image", { status: 500 })
  }
}
