import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

// Enhanced markdown parser that handles all formatting
function parseMarkdownContent(text: string): Array<{ type: string; content: string; style?: any }> {
  const elements: Array<{ type: string; content: string; style?: any }> = []

  // Split by double line breaks to get sections
  const sections = text.split("\n\n").filter((section) => section.trim())

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim()

    // Determine section type and styling
    if (
      i === 0 &&
      (section.includes("🎵") || section.includes("🎶") || section.startsWith("#") || section.includes("**"))
    ) {
      // Title section
      elements.push({
        type: "title",
        content: section,
        style: {
          fontSize: "36px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "24px",
          lineHeight: "1.2",
        },
      })
    } else if (section.toLowerCase().includes("score:") || section.includes("**SCORE")) {
      // Score section
      elements.push({
        type: "score",
        content: section,
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "16px",
        },
      })
    } else if (
      section.startsWith("–") ||
      section.startsWith("-") ||
      section.includes("Music Snob") ||
      section.includes("Taste Validator") ||
      section.includes("Music Historian")
    ) {
      // Signature section
      elements.push({
        type: "signature",
        content: section,
        style: {
          fontSize: "24px",
          fontStyle: "italic",
          textAlign: "right",
          marginTop: "20px",
        },
      })
    } else {
      // Regular paragraph
      elements.push({
        type: "paragraph",
        content: section,
        style: {
          fontSize: "26px",
          marginBottom: "16px",
          lineHeight: "1.4",
        },
      })
    }
  }

  return elements
}

// Function to render markdown-styled text
function renderMarkdownText(text: string, baseColor: string, accentColor: string) {
  // Handle bold text (**text**)
  const boldRegex = /\*\*(.*?)\*\*/g
  // Handle italic text (*text*)
  const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g

  const processedText = text
  const spans = []
  let lastIndex = 0

  // Process bold text
  let match
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before bold
    if (match.index > lastIndex) {
      spans.push({
        text: text.substring(lastIndex, match.index),
        style: { color: baseColor },
      })
    }

    // Add bold text
    spans.push({
      text: match[1],
      style: { color: accentColor, fontWeight: "bold" },
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    spans.push({
      text: text.substring(lastIndex),
      style: { color: baseColor },
    })
  }

  // If no bold text found, process italic
  if (spans.length === 0) {
    lastIndex = 0
    while ((match = italicRegex.exec(text)) !== null) {
      // Add text before italic
      if (match.index > lastIndex) {
        spans.push({
          text: text.substring(lastIndex, match.index),
          style: { color: baseColor },
        })
      }

      // Add italic text
      spans.push({
        text: match[1],
        style: { color: baseColor, fontStyle: "italic" },
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      spans.push({
        text: text.substring(lastIndex),
        style: { color: baseColor },
      })
    }
  }

  // If no formatting found, return plain text
  if (spans.length === 0) {
    spans.push({
      text: text,
      style: { color: baseColor },
    })
  }

  return spans
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get("text") || "Your music taste is... interesting."
    const type = searchParams.get("type") || "snob"

    // Get colors based on assistant type
    let accentColor = "#c084fc" // Purple for snob
    let gradientStart = "#9333ea"
    let gradientEnd = "#c084fc"
    const baseTextColor = "#ffffff"

    if (type === "worshipper") {
      accentColor = "#c084fc"
      gradientStart = "#9333ea"
      gradientEnd = "#c084fc"
    } else if (type === "historian") {
      accentColor = "#60a5fa"
      gradientStart = "#3b82f6"
      gradientEnd = "#60a5fa"
    }

    // Parse the markdown content
    const parsedElements = parseMarkdownContent(text)

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          padding: "25px 15px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {/* Vinyl Record Icon */}
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              backgroundColor: "#1a1a1a",
              border: "2px solid #333",
              marginRight: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: accentColor,
              }}
            />
          </div>

          {/* Brand */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: accentColor,
              }}
            >
              VinylVerdict
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#888",
                display: "flex",
              }}
            >
              .fm
            </div>
          </div>
        </div>

        {/* Content Area - Styled exactly like the roast container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#121212",
            borderRadius: "16px",
            padding: "20px",
            border: `2px solid ${accentColor}`,
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Render all parsed elements */}
          {parsedElements.map((element, index) => {
            const spans = renderMarkdownText(
              element.content,
              element.type === "title" || element.type === "score" ? accentColor : baseTextColor,
              accentColor,
            )

            return (
              <div
                key={index}
                style={{
                  ...element.style,
                  display: "flex",
                  flexWrap: "wrap",
                  wordWrap: "break-word",
                }}
              >
                {spans.map((span, spanIndex) => (
                  <span key={spanIndex} style={span.style}>
                    {span.text}
                  </span>
                ))}
              </div>
            )
          })}
        </div>

        {/* Spotify Attribution with SVG Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "12px",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#888",
              marginRight: "4px",
              display: "flex",
            }}
          >
            Powered by
          </div>
          {/* Spotify Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#000000",
              borderRadius: "10px",
              padding: "3px 6px",
              height: "20px",
            }}
          >
            <svg width="60" height="18" viewBox="0 0 170 54" fill="#1DB954">
              <path d="M27 0C12.1 0 0 12.1 0 27s12.1 27 27 27 27-12.1 27-27S41.9 0 27 0zm12.3 39c-.5.8-1.5 1-2.2.5-6.1-3.7-13.7-4.6-22.7-2.5-.9.2-1.8-.4-2-1.2-.2-.9.4-1.8 1.2-2 9.8-2.2 18.2-1.3 25 2.9.9.5 1.1 1.5.7 2.3zm3.3-7.3c-.6 1-1.9 1.3-2.9.7-7-4.3-17.6-5.5-25.8-3-.1 0-.2.1-.3.1-1.1.3-2.3-.3-2.6-1.5-.3-1.1.3-2.3 1.5-2.6 9.2-2.8 24.5-2.3 34.1 3.5 1.3.8 1.7 2.4.9 3.7-.7 1.2-2.3 1.7-3 .6z" />
              <path d="M63.3 26.4c-5.2-1.2-6.1-2.1-6.1-3.9 0-1.7 1.6-2.9 4-2.9 2.3 0 4.6.9 7 2.7.1 0 .1.1.2.1.2.1.4.1.5 0l2-2.8c.2-.3.2-.7-.1-.9-2.9-2.2-6.1-3.3-9.6-3.3-5.4 0-9.2 3.2-9.2 7.9 0 5 3.2 6.7 8.8 8.1 4.7 1.2 5.5 2.2 5.5 3.9 0 1.9-1.7 3.1-4.5 3.1-3.1 0-5.6-1-8.4-3.5-.1-.1-.1-.1-.2-.1-.2-.1-.4-.1-.5 0l-2.2 2.6c-.3.3-.2.7.1 1 3.2 2.9 7.2 4.4 11.1 4.4 5.9 0 9.7-3.2 9.7-8.1.1-4.2-2.5-6.5-8.1-8.3zm22.5-4.8c-2.6 0-4.7 1-6.5 3.1v-2.4c0-.4-.3-.7-.7-.7h-3.9c-.4 0-.7.3-.7.7v24.2c0 .4.3.7.7.7h3.9c.4 0 .7-.3.7-.7V35.1c1.7 2 3.9 3 6.5 3 4.8 0 9.7-3.7 9.7-10.7 0-7.1-4.9-10.8-9.7-10.8zm4.3 10.7c0 3.6-2.2 6.1-5.4 6.1-3.1 0-5.5-2.6-5.5-6.1 0-3.6 2.3-6.1 5.5-6.1 3.1 0 5.4 2.6 5.4 6.1zm19.4-10.7c-6.1 0-10.9 4.7-10.9 10.8s4.8 10.7 10.9 10.7c6.1 0 10.9-4.7 10.9-10.7 0-6.1-4.8-10.8-10.9-10.8zm0 17.2c-3.4 0-6.1-2.8-6.1-6.4 0-3.7 2.6-6.4 6.1-6.4 3.4 0 6.1 2.8 6.1 6.4 0 3.7-2.7 6.4-6.1 6.4zm25.6-16.5h-4.3v-4.4c0-.4-.3-.7-.7-.7h-3.9c-.4 0-.7.3-.7.7v4.4h-1.9c-.4 0-.7.3-.7.7v3.3c0 .4.3.7.7.7h1.9v8.9c0 3.6 1.8 5.4 5.3 5.4 1.4 0 2.6-.3 3.7-.9.1-.1.2-.2.2-.4v-3.2c0-.2-.1-.4-.3-.5-.2-.1-.4-.1-.6 0-.7.3-1.3.5-2 .5-1.1 0-1.6-.5-1.6-1.6v-8.2h4.3c.4 0 .7-.3.7-.7v-3.3c0-.4-.3-.7-.7-.7zm15.1.1v-.5c0-1.5.6-2.2 1.8-2.2.7 0 1.3.2 1.9.4.2.1.4 0 .5-.1.1-.1.2-.3.2-.4v-3.3c0-.3-.2-.5-.4-.6-1-.3-1.9-.5-3.3-.5-3.7 0-5.6 2.1-5.6 6v1.1h-1.9c-.4 0-.7.3-.7.7v3.3c0 .4.3.7.7.7h1.9v13.1c0 .4.3.7.7.7h3.9c.4 0 .7-.3.7-.7V26.7h3.7l5.6 13.1c-.6 1.4-1.2 1.7-2.1 1.7-.7 0-1.4-.2-2.1-.6-.1-.1-.2-.1-.4-.1-.1 0-.3.1-.4.2l-1.3 2.9c-.2.4 0 .8.3 1 1.5.8 2.9 1.1 4.6 1.1 3.2 0 4.9-1.5 6.5-5.4l7.5-19.4c.1-.2 0-.4-.1-.6-.1-.1-.3-.2-.5-.2h-4c-.3 0-.6.2-.7.5l-4.6 13.1-5-13.1c-.1-.3-.4-.5-.7-.5h-6.6zm-8.5-.1h-3.9c-.4 0-.7.3-.7.7v17.1c0 .4.3.7.7.7h3.9c.4 0 .7-.3.7-.7V22.9c0-.4-.3-.7-.7-.7zm-1.9-7.7c-1.6 0-2.8 1.3-2.8 2.8 0 1.6 1.3 2.8 2.8 2.8 1.6 0 2.8-1.3 2.8-2.8 0-1.5-1.3-2.8-2.8-2.8zm35 7.6h-3.9c-.4 0-.7.3-.7.7v.8c-1.2-1.2-2.9-1.9-5.2-1.9-4.9 0-9.5 3.8-9.5 10.7 0 6.8 4.5 10.7 9.5 10.7 2.3 0 4-.7 5.2-1.9v.8c0 .4.3.7.7.7h3.9c.4 0 .7-.3.7-.7V22.9c0-.4-.3-.7-.7-.7zm-8.8 16.5c-3.2 0-5.5-2.6-5.5-6.1 0-3.6 2.3-6.1 5.5-6.1 3.2 0 5.5 2.6 5.5 6.1-.1 3.5-2.3 6.1-5.5 6.1z" />
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "6px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              display: "flex",
            }}
          >
            Get your own verdict at vinylverdict.fm
          </div>
        </div>
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, type } = body

    if (!text) {
      return new Response("Missing text parameter", { status: 400 })
    }

    // Get colors based on assistant type
    let accentColor = "#c084fc" // Purple for snob
    let gradientStart = "#9333ea"
    let gradientEnd = "#c084fc"
    const baseTextColor = "#ffffff"

    if (type === "worshipper") {
      accentColor = "#c084fc"
      gradientStart = "#9333ea"
      gradientEnd = "#c084fc"
    } else if (type === "historian") {
      accentColor = "#60a5fa"
      gradientStart = "#3b82f6"
      gradientEnd = "#60a5fa"
    }

    // Parse the markdown content
    const parsedElements = parseMarkdownContent(text)

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          padding: "25px 15px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {/* Vinyl Record Icon */}
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              backgroundColor: "#1a1a1a",
              border: "2px solid #333",
              marginRight: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: accentColor,
              }}
            />
          </div>

          {/* Brand */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: accentColor,
              }}
            >
              VinylVerdict
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#888",
                display: "flex",
              }}
            >
              .fm
            </div>
          </div>
        </div>

        {/* Content Area - Styled exactly like the roast container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#121212",
            borderRadius: "16px",
            padding: "20px",
            border: `2px solid ${accentColor}`,
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Render all parsed elements */}
          {parsedElements.map((element, index) => {
            const spans = renderMarkdownText(
              element.content,
              element.type === "title" || element.type === "score" ? accentColor : baseTextColor,
              accentColor,
            )

            return (
              <div
                key={index}
                style={{
                  ...element.style,
                  display: "flex",
                  flexWrap: "wrap",
                  wordWrap: "break-word",
                }}
              >
                {spans.map((span, spanIndex) => (
                  <span key={spanIndex} style={span.style}>
                    {span.text}
                  </span>
                ))}
              </div>
            )
          })}
        </div>

        {/* Spotify Attribution with SVG Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "12px",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#888",
              marginRight: "4px",
              display: "flex",
            }}
          >
            Powered by
          </div>
          {/* Spotify Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#000000",
              borderRadius: "10px",
              padding: "3px 6px",
              height: "20px",
            }}
          >
            <svg width="60" height="18" viewBox="0 0 170 54" fill="#1DB954">
              <path d="M27 0C12.1 0 0 12.1 0 27s12.1 27 27 27 27-12.1 27-27S41.9 0 27 0zm12.3 39c-.5.8-1.5 1-2.2.5-6.1-3.7-13.7-4.6-22.7-2.5-.9.2-1.8-.4-2-1.2-.2-.9.4-1.8 1.2-2 9.8-2.2 18.2-1.3 25 2.9.9.5 1.1 1.5.7 2.3zm3.3-7.3c-.6 1-1.9 1.3-2.9.7-7-4.3-17.6-5.5-25.8-3-.1 0-.2.1-.3.1-1.1.3-2.3-.3-2.6-1.5-.3-1.1.3-2.3 1.5-2.6 9.2-2.8 24.5-2.3 34.1 3.5 1.3.8 1.7 2.4.9 3.7-.7 1.2-2.3 1.7-3 .6z" />
              <path d="M63.3 26.4c-5.2-1.2-6.1-2.1-6.1-3.9 0-1.7 1.6-2.9 4-2.9 2.3 0 4.6.9 7 2.7.1 0 .1.1.2.1.2.1.4.1.5 0l2-2.8c.2-.3.2-.7-.1-.9-2.9-2.2-6.1-3.3-9.6-3.3-5.4 0-9.2 3.2-9.2 7.9 0 5 3.2 6.7 8.8 8.1 4.7 1.2 5.5 2.2 5.5 3.9 0 1.9-1.7 3.1-4.5 3.1-3.1 0-5.6-1-8.4-3.5-.1-.1-.1-.1-.2-.1-.2-.1-.4-.1-.5 0l-2.2 2.6c-.3.3-.2.7.1 1 3.2 2.9 7.2 4.4 11.1 4.4 5.9 0 9.7-3.2 9.7-8.1.1-4.2-2.5-6.5-8.1-8.3zm22.5-4.8c-2.6 0-4.7 1-6.5 3.1v-2.4c0-.4-.3-.7-.7-.7h-3.9c-.4 0-.7.3-.7.7v24.2c0 .4.3.7.7.7h3.9c.4 0 .7-.3.7-.7V35.1c1.7 2 3.9 3 6.5 3 4.8 0 9.7-3.7 9.7-10.7 0-7.1-4.9-10.8-9.7-10.8zm4.3 10.7c0 3.6-2.2 6.1-5.4 6.1-3.1 0-5.5-2.6-5.5-6.1 0-3.6 2.3-6.1 5.5-6.1 3.1 0 5.4 2.6 5.4 6.1zm19.4-10.7c-6.1 0-10.9 4.7-10.9 10.8s4.8 10.7 10.9 10.7c6.1 0 10.9-4.7 10.9-10.7 0-6.1-4.8-10.8-10.9-10.8zm0 17.2c-3.4 0-6.1-2.8-6.1-6.4 0-3.7 2.6-6.4 6.1-6.4 3.4 0 6.1 2.8 6.1 6.4 0 3.7-2.7 6.4-6.1 6.4zm25.6-16.5h-4.3v-4.4c0-.4-.3-.7-.7-.7h-3.9c-.4 0-.7.3-.7.7v4.4h-1.9c-.4 0-.7.3-.7.7v3.3c0 .4.3.7.7.7h1.9v8.9c0 3.6 1.8 5.4 5.3 5.4 1.4 0 2.6-.3 3.7-.9.1-.1.2-.2.2-.4v-3.2c0-.2-.1-.4-.3-.5-.2-.1-.4-.1-.6 0-.7.3-1.3.5-2 .5-1.1 0-1.6-.5-1.6-1.6v-8.2h4.3c.4 0 .7-.3.7-.7v-3.3c0-.4-.3-.7-.7-.7zm15.1.1v-.5c0-1.5.6-2.2 1.8-2.2.7 0 1.3.2 1.9.4.2.1.4 0 .5-.1.1-.1.2-.3.2-.4v-3.3c0-.3-.2-.5-.4-.6-1-.3-1.9-.5-3.3-.5-3.7 0-5.6 2.1-5.6 6v1.1h-1.9c-.4 0-.7.3-.7.7v3.3c0 .4.3.7.7.7h1.9v13.1c0 .4.3.7.7.7h3.9c.4 0 .7-.3.7-.7V26.7h3.7l5.6 13.1c-.6 1.4-1.2 1.7-2.1 1.7-.7 0-1.4-.2-2.1-.6-.1-.1-.2-.1-.4-.1-.1 0-.3.1-.4.2l-1.3 2.9c-.2.4 0 .8.3 1 1.5.8 2.9 1.1 4.6 1.1 3.2 0 4.9-1.5 6.5-5.4l7.5-19.4c.1-.2 0-.4-.1-.6-.1-.1-.3-.2-.5-.2h-4c-.3 0-.6.2-.7.5l-4.6 13.1-5-13.1c-.1-.3-.4-.5-.7-.5h-6.6zm-8.5-.1h-3.9c-.4 0-.7.3-.7.7v17.1c0 .4.3.7.7.7h3.9c.4 0 .7-.3.7-.7V22.9c0-.4-.3-.7-.7-.7zm-1.9-7.7c-1.6 0-2.8 1.3-2.8 2.8 0 1.6 1.3 2.8 2.8 2.8 1.6 0 2.8-1.3 2.8-2.8 0-1.5-1.3-2.8-2.8-2.8zm35 7.6h-3.9c-.4 0-.7.3-.7.7v.8c-1.2-1.2-2.9-1.9-5.2-1.9-4.9 0-9.5 3.8-9.5 10.7 0 6.8 4.5 10.7 9.5 10.7 2.3 0 4-.7 5.2-1.9v.8c0 .4.3.7.7.7h3.9c.4 0 .7-.3.7-.7V22.9c0-.4-.3-.7-.7-.7zm-8.8 16.5c-3.2 0-5.5-2.6-5.5-6.1 0-3.6 2.3-6.1 5.5-6.1 3.2 0 5.5 2.6 5.5 6.1-.1 3.5-2.3 6.1-5.5 6.1z" />
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "6px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              display: "flex",
            }}
          >
            Get your own verdict at vinylverdict.fm
          </div>
        </div>
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
