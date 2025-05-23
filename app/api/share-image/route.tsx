import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

// Simple markdown parser for basic formatting
function parseMarkdown(text: string): Array<{ type: string; content: string; style?: any }> {
  const elements: Array<{ type: string; content: string; style?: any }> = []

  // Split by lines and process each
  const lines = text.split("\n").filter((line) => line.trim())

  for (const line of lines) {
    let content = line.trim()

    // Handle headers
    if (content.startsWith("### ")) {
      elements.push({
        type: "h3",
        content: content.replace("### ", ""),
        style: { fontSize: "28px", fontWeight: "bold", color: "#c084fc", marginBottom: "8px" },
      })
    } else if (content.startsWith("## ")) {
      elements.push({
        type: "h2",
        content: content.replace("## ", ""),
        style: { fontSize: "32px", fontWeight: "bold", color: "#c084fc", marginBottom: "12px" },
      })
    } else if (content.startsWith("# ")) {
      elements.push({
        type: "h1",
        content: content.replace("# ", ""),
        style: { fontSize: "36px", fontWeight: "bold", color: "#c084fc", marginBottom: "16px" },
      })
    } else {
      // Handle bold and italic text
      content = content.replace(/\*\*(.*?)\*\*/g, "$1") // Remove ** for bold (we'll style it)
      content = content.replace(/\*(.*?)\*/g, "$1") // Remove * for italic

      elements.push({
        type: "p",
        content,
        style: { fontSize: "24px", color: "#ffffff", marginBottom: "12px", lineHeight: "1.4" },
      })
    }
  }

  return elements
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get("text") || "Your music taste is... interesting."
    const type = searchParams.get("type") || "snob"

    // Parse the markdown text
    const parsedElements = parseMarkdown(text)

    // Get colors based on assistant type
    let accentColor = "#c084fc" // Purple
    let titleText = "Music Snob's Take"

    if (type === "worshipper") {
      accentColor = "#c084fc"
      titleText = "Taste Validator"
    } else if (type === "historian") {
      accentColor = "#60a5fa"
      titleText = "Music Historian"
    }

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          {/* Vinyl Record Icon */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#1a1a1a",
              border: "2px solid #333",
              marginRight: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: accentColor,
              }}
            />
          </div>

          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                background: `linear-gradient(45deg, ${accentColor}, #9333ea)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              VinylVerdict
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "#888",
              }}
            >
              .fm
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            color: accentColor,
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          {titleText}
        </div>

        {/* Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "20px",
            padding: "40px",
            border: `2px solid ${accentColor}`,
            flex: 1,
            maxHeight: "600px",
            overflow: "hidden",
          }}
        >
          {parsedElements.map((element, index) => (
            <div
              key={index}
              style={{
                ...element.style,
                display: "block",
              }}
            >
              {element.content}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#888",
            }}
          >
            Get your own verdict at vinylverdict.fm
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "8px",
            background: `linear-gradient(90deg, ${accentColor}, #9333ea, ${accentColor})`,
            opacity: 0.6,
          }}
        />
      </div>,
      {
        width: 1080,
        height: 1920,
        headers: {
          "content-type": "image/png",
          "cache-control": "public, max-age=3600, s-maxage=3600",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("Error generating share image:", error)
    return new Response("Error generating image", { status: 500 })
  }
}
