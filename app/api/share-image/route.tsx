import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

// Enhanced markdown parser that preserves formatting like the original roast
function parseRoastText(text: string): Array<{ type: string; content: string; style?: any }> {
  const elements: Array<{ type: string; content: string; style?: any }> = []

  // Split by double line breaks to get paragraphs
  const sections = text.split("\n\n").filter((section) => section.trim())

  for (const section of sections) {
    const trimmedSection = section.trim()

    // Handle title (first line if it looks like a title)
    if ((sections.indexOf(section) === 0 && trimmedSection.includes("🎵")) || trimmedSection.includes("🎶")) {
      elements.push({
        type: "title",
        content: trimmedSection,
        style: {
          fontSize: "36px",
          fontWeight: "bold",
          color: "#c084fc",
          marginBottom: "24px",
          textAlign: "center",
        },
      })
    }
    // Handle score section
    else if (trimmedSection.toUpperCase().includes("SCORE:")) {
      elements.push({
        type: "score",
        content: trimmedSection,
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          color: "#c084fc",
          marginTop: "24px",
          marginBottom: "16px",
        },
      })
    }
    // Handle signature (lines starting with – or -)
    else if (trimmedSection.startsWith("–") || trimmedSection.startsWith("-")) {
      elements.push({
        type: "signature",
        content: trimmedSection,
        style: {
          fontSize: "20px",
          color: "#a855f7",
          fontStyle: "italic",
          marginTop: "16px",
          textAlign: "right",
        },
      })
    }
    // Handle regular paragraphs
    else {
      // Split long paragraphs into smaller chunks for better readability
      const lines = trimmedSection.split("\n").filter((line) => line.trim())

      for (const line of lines) {
        if (line.trim()) {
          elements.push({
            type: "paragraph",
            content: line.trim(),
            style: {
              fontSize: "22px",
              color: "#ffffff",
              marginBottom: "16px",
              lineHeight: "1.5",
            },
          })
        }
      }
    }
  }

  return elements
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get("text") || "Your music taste is... interesting."
    const type = searchParams.get("type") || "snob"

    // Parse the roast text
    const parsedElements = parseRoastText(text)

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
          padding: "40px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          {/* Vinyl Record Icon */}
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#1a1a1a",
              border: "2px solid #333",
              marginRight: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: accentColor,
              }}
            />
          </div>

          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "28px",
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
                fontSize: "14px",
                color: "#888",
              }}
            >
              .fm
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            padding: "32px",
            border: `2px solid ${accentColor}`,
            flex: 1,
            maxHeight: "1400px",
            overflow: "hidden",
          }}
        >
          {parsedElements.map((element, index) => (
            <div
              key={index}
              style={{
                ...element.style,
                display: "block",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {element.content}
            </div>
          ))}
        </div>

        {/* Spotify Attribution */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "24px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#888",
              marginRight: "12px",
            }}
          >
            Powered by
          </div>
          {/* Spotify Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1DB954",
              borderRadius: "20px",
              padding: "8px 16px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#000000",
              }}
            >
              Spotify
            </div>
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#888",
              marginLeft: "8px",
            }}
          >
            Web API
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "#666",
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
            height: "6px",
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
