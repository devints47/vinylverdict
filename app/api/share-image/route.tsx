import type React from "react"
import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

// Enhanced markdown parser that preserves formatting like the original roast
function parseRoastText(text: string): Array<{ type: string; content: string; style?: any; isMarkdown?: boolean }> {
  const elements: Array<{ type: string; content: string; style?: any; isMarkdown?: boolean }> = []

  // Calculate dynamic font sizes based on text length
  const textLength = text.length
  let baseFontSize =
    textLength > 2500 ? 22 : textLength > 2000 ? 24 : textLength > 1500 ? 26 : textLength > 1000 ? 28 : 32
  let titleFontSize = Math.max(baseFontSize + 12, 40)
  let scoreFontSize = Math.max(baseFontSize + 8, 36)
  let signatureFontSize = Math.max(baseFontSize - 4, 24)

  // Adjust font size further if there are many paragraphs
  const paragraphCount = text.split("\n\n").filter((p) => p.trim()).length
  if (paragraphCount > 8) {
    baseFontSize = Math.max(baseFontSize - 4, 18)
    titleFontSize = Math.max(titleFontSize - 4, 36)
    scoreFontSize = Math.max(scoreFontSize - 4, 32)
    signatureFontSize = Math.max(signatureFontSize - 2, 22)
  }

  // Split by double line breaks to get paragraphs
  const sections = text.split("\n\n").filter((section) => section.trim())

  for (const section of sections) {
    const trimmedSection = section.trim()

    // Handle title (first line if it looks like a title or contains emojis or starts with #)
    if (
      sections.indexOf(section) === 0 &&
      (trimmedSection.includes("🎵") ||
        trimmedSection.includes("🎶") ||
        trimmedSection.startsWith("#") ||
        trimmedSection.includes("**"))
    ) {
      elements.push({
        type: "title",
        content: trimmedSection,
        style: {
          fontSize: `${titleFontSize}px`,
          fontWeight: "bold",
          color: "#c084fc",
          marginBottom: "24px",
          textAlign: "center",
          lineHeight: "1.2",
          padding: "0 20px",
        },
        isMarkdown: true,
      })
    }
    // Handle score section
    else if (trimmedSection.toUpperCase().includes("SCORE:") || trimmedSection.includes("**SCORE")) {
      elements.push({
        type: "score",
        content: trimmedSection,
        style: {
          fontSize: `${scoreFontSize}px`,
          fontWeight: "bold",
          color: "#c084fc",
          marginTop: "24px",
          marginBottom: "16px",
          textAlign: "center",
        },
        isMarkdown: true,
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
          marginTop: "24px",
          textAlign: "right",
          padding: "0 20px",
        },
        isMarkdown: false,
      })
    }
    // Handle regular paragraphs with markdown support
    else {
      // Split long paragraphs into smaller chunks for better readability
      const lines = trimmedSection.split("\n").filter((line) => line.trim())

      for (const line of lines) {
        if (line.trim()) {
          elements.push({
            type: "paragraph",
            content: line.trim(),
            style: {
              fontSize: `${baseFontSize}px`,
              color: "#ffffff",
              marginBottom: "16px",
              lineHeight: "1.4",
              padding: "0 20px",
            },
            isMarkdown: true,
          })
        }
      }
    }
  }

  return elements
}

// Process markdown formatting for rendering
function renderMarkdownElement(content: string): React.ReactNode[] {
  // Split the content by potential markdown sections
  const parts: React.ReactNode[] = []
  let currentText = ""
  let i = 0

  while (i < content.length) {
    // Check for bold text (**text**)
    if (content.substring(i, i + 2) === "**" && i + 2 < content.length) {
      // Add any text before the bold marker
      if (currentText) {
        parts.push(<span key={`text-${parts.length}`}>{currentText}</span>)
        currentText = ""
      }

      // Find the closing **
      const boldStart = i + 2
      const boldEnd = content.indexOf("**", boldStart)

      if (boldEnd !== -1) {
        const boldText = content.substring(boldStart, boldEnd)
        parts.push(
          <span key={`bold-${parts.length}`} style={{ fontWeight: "bold" }}>
            {boldText}
          </span>,
        )
        i = boldEnd + 2 // Skip past the closing **
      } else {
        // No closing **, treat as normal text
        currentText += "**"
        i += 2
      }
    }
    // Check for italic text (*text*)
    else if (content[i] === "*" && i + 1 < content.length && content[i + 1] !== "*") {
      // Add any text before the italic marker
      if (currentText) {
        parts.push(<span key={`text-${parts.length}`}>{currentText}</span>)
        currentText = ""
      }

      // Find the closing *
      const italicStart = i + 1
      const italicEnd = content.indexOf("*", italicStart)

      if (italicEnd !== -1) {
        const italicText = content.substring(italicStart, italicEnd)
        parts.push(
          <span key={`italic-${parts.length}`} style={{ fontStyle: "italic" }}>
            {italicText}
          </span>,
        )
        i = italicEnd + 1 // Skip past the closing *
      } else {
        // No closing *, treat as normal text
        currentText += "*"
        i += 1
      }
    }
    // Check for hashtag titles
    else if (content[i] === "#" && (i === 0 || content[i - 1] === " ")) {
      // Add any text before the hashtag
      if (currentText) {
        parts.push(<span key={`text-${parts.length}`}>{currentText}</span>)
        currentText = ""
      }

      // Count the number of consecutive #
      let hashCount = 0
      while (i + hashCount < content.length && content[i + hashCount] === "#") {
        hashCount++
      }

      // Add the hashtags as they are
      currentText += content.substring(i, i + hashCount)
      i += hashCount
    }
    // Regular text
    else {
      currentText += content[i]
      i++
    }
  }

  // Add any remaining text
  if (currentText) {
    parts.push(<span key={`text-${parts.length}`}>{currentText}</span>)
  }

  return parts
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
          padding: "40px 20px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
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
              marginRight: "12px",
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
            padding: "24px 16px",
            border: `2px solid ${accentColor}`,
            flex: 1,
            overflow: "hidden",
            maxHeight: "calc(100% - 180px)", // Ensure content fits
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
              {element.isMarkdown ? renderMarkdownElement(element.content) : element.content}
            </div>
          ))}
        </div>

        {/* Spotify Attribution with SVG Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#888",
              marginRight: "8px",
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
              borderRadius: "16px",
              padding: "6px 12px",
              height: "32px",
            }}
          >
            <svg width="80" height="24" viewBox="0 0 170 54" fill="#1DB954">
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
            marginTop: "10px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
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
