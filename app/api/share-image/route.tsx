import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

// Enhanced markdown parser that preserves formatting like the original roast
function parseRoastText(text: string): Array<{ type: string; content: string; style?: any }> {
  const elements: Array<{ type: string; content: string; style?: any }> = []

  // Calculate dynamic font sizes based on text length
  const textLength = text.length
  const baseFontSize = textLength > 2000 ? 28 : textLength > 1500 ? 32 : textLength > 1000 ? 36 : 40
  const titleFontSize = Math.max(baseFontSize + 12, 44)
  const scoreFontSize = Math.max(baseFontSize + 8, 40)
  const signatureFontSize = Math.max(baseFontSize - 4, 24)

  // Split by double line breaks to get paragraphs
  const sections = text.split("\n\n").filter((section) => section.trim())

  for (const section of sections) {
    const trimmedSection = section.trim()

    // Handle title (first line if it looks like a title or contains emojis)
    if (
      (sections.indexOf(section) === 0 && (trimmedSection.includes("🎵") || trimmedSection.includes("🎶"))) ||
      (trimmedSection.includes("**") && sections.indexOf(section) === 0)
    ) {
      // Remove markdown formatting
      const cleanTitle = trimmedSection.replace(/\*\*/g, "")
      elements.push({
        type: "title",
        content: cleanTitle,
        style: {
          fontSize: `${titleFontSize}px`,
          fontWeight: "bold",
          color: "#c084fc",
          marginBottom: "32px",
          textAlign: "center",
          lineHeight: "1.2",
          padding: "0 20px",
        },
      })
    }
    // Handle score section
    else if (trimmedSection.toUpperCase().includes("SCORE:") || trimmedSection.includes("**SCORE")) {
      const cleanScore = trimmedSection.replace(/\*\*/g, "")
      elements.push({
        type: "score",
        content: cleanScore,
        style: {
          fontSize: `${scoreFontSize}px`,
          fontWeight: "bold",
          color: "#c084fc",
          marginTop: "32px",
          marginBottom: "24px",
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
          fontSize: `${signatureFontSize}px`,
          color: "#a855f7",
          fontStyle: "italic",
          marginTop: "32px",
          textAlign: "right",
          padding: "0 20px",
        },
      })
    }
    // Handle regular paragraphs with markdown support
    else {
      // Process markdown formatting
      const processedText = processMarkdown(trimmedSection)

      // Split long paragraphs into smaller chunks for better readability
      const lines = processedText.split("\n").filter((line) => line.trim())

      for (const line of lines) {
        if (line.trim()) {
          elements.push({
            type: "paragraph",
            content: line.trim(),
            style: {
              fontSize: `${baseFontSize}px`,
              color: "#ffffff",
              marginBottom: "20px",
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

// Process markdown formatting
function processMarkdown(text: string): string {
  // Handle bold text (**text** or __text__)
  text = text.replace(/\*\*(.*?)\*\*/g, "$1")
  text = text.replace(/__(.*?)__/g, "$1")

  // Handle italic text (*text* or _text_)
  text = text.replace(/\*(.*?)\*/g, "$1")
  text = text.replace(/_(.*?)_/g, "$1")

  // Handle code blocks (`text`)
  text = text.replace(/`(.*?)`/g, "$1")

  return text
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
          padding: "50px 30px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          justifyContent: "space-between",
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
              border: "3px solid #333",
              marginRight: "16px",
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
                fontSize: "36px",
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

        {/* Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "20px",
            padding: "40px 25px",
            border: `2px solid ${accentColor}`,
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
            marginTop: "32px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
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
                fontSize: "20px",
                fontWeight: "bold",
                color: "#000000",
              }}
            >
              Spotify
            </div>
          </div>
          <div
            style={{
              fontSize: "18px",
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
            marginTop: "16px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
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
