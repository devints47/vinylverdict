import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get("text") || "Music Taste Verdict"
    const type = searchParams.get("type") || "snob"

    // Get title and emoji based on type
    let title = "Music Taste Verdict"
    let emoji = "🔥"

    if (type === "worshipper") {
      title = "Music Taste Validation"
      emoji = "✨"
    } else if (type === "historian") {
      title = "Music History Analysis"
      emoji = "📚"
    }

    // Truncate text for display
    const displayText = text.length > 300 ? text.substring(0, 300) + "..." : text

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #1e1e1e, #121212, #0a0a0a)",
          padding: "40px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2,
            background: "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.3), transparent 70%)",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
              marginBottom: "30px",
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

          {/* Content preview */}
          <div
            style={{
              fontSize: 24,
              color: "#e4e4e7",
              lineHeight: 1.4,
              marginBottom: "40px",
              maxWidth: "90%",
              textAlign: "center",
              background: "rgba(24, 24, 27, 0.8)",
              padding: "30px",
              borderRadius: "12px",
              border: "1px solid rgba(147, 51, 234, 0.3)",
            }}
          >
            {displayText}
          </div>

          {/* Branding */}
          <div
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#9333ea",
              textAlign: "center",
            }}
          >
            VinylVerdict.FM
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
