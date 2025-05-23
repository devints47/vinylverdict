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
          fontSize: "52px", // Increased from 36px
          fontWeight: "bold",
          color: "#c084fc",
          marginBottom: "40px", // Increased from 24px
          textAlign: "center",
          lineHeight: "1.2",
          padding: "0 20px",
        },
      })
    }
    // Handle score section
    else if (trimmedSection.toUpperCase().includes("SCORE:")) {
      elements.push({
        type: "score",
        content: trimmedSection,
        style: {
          fontSize: "48px", // Increased from 32px
          fontWeight: "bold",
          color: "#c084fc",
          marginTop: "40px", // Increased from 24px
          marginBottom: "30px", // Increased from 16px
          textAlign: "center",
        },
      })
    }
    // Handle signature (lines starting with – or -)
    else if (trimmedSection.startsWith("–") || trimmedSection.startsWith("-")) {
      elements.push({
        type: "signature",
        content: trimmedSection,
        style: {
          fontSize: "32px", // Increased from 20px
          color: "#a855f7",
          fontStyle: "italic",
          marginTop: "40px", // Increased from 16px
          textAlign: "right",
          padding: "0 20px",
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
              fontSize: "36px", // Increased from 22px
              color: "#ffffff",
              marginBottom: "30px", // Increased from 16px
              lineHeight: "1.4",
              padding: "0 20px",
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
          padding: "60px 40px", // Increased padding
          fontFamily: "system-ui, -apple-system, sans-serif",
          justifyContent: "space-between", // Distribute content evenly
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "50px", // Increased from 30px
          }}
        >
          {/* Vinyl Record Icon */}
          <div
            style={{
              width: "70px", // Increased from 50px
              height: "70px", // Increased from 50px
              borderRadius: "50%",
              backgroundColor: "#1a1a1a",
              border: "3px solid #333", // Increased from 2px
              marginRight: "20px", // Increased from 16px
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "24px", // Increased from 16px
                height: "24px", // Increased from 16px
                borderRadius: "50%",
                backgroundColor: accentColor,
              }}
            />
          </div>

          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "42px", // Increased from 28px
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
                fontSize: "20px", // Increased from 14px
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
            borderRadius: "24px", // Increased from 16px
            padding: "50px 30px", // Increased from 32px
            border: `3px solid ${accentColor}`, // Increased from 2px
            flex: 1,
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
            marginTop: "40px", // Increased from 24px
            marginBottom: "20px", // Increased from 16px
          }}
        >
          <div
            style={{
              fontSize: "22px", // Increased from 16px
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
              borderRadius: "24px", // Increased from 20px
              padding: "10px 20px", // Increased from 8px 16px
            }}
          >
            <div
              style={{
                fontSize: "24px", // Increased from 18px
                fontWeight: "bold",
                color: "#000000",
              }}
            >
              Spotify
            </div>
          </div>
          <div
            style={{
              fontSize: "22px", // Increased from 16px
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
            marginTop: "20px", // Added margin
          }}
        >
          <div
            style={{
              fontSize: "24px", // Increased from 18px
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
            height: "10px", // Increased from 6px
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
