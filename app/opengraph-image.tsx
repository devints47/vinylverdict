import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "VinylVerdict.FM - Your Personal Music Taste Analyst"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%)",
        padding: "60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
          background: "radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.4), transparent 60%), radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.3), transparent 60%)",
          zIndex: 0,
        }}
      />

      {/* Left side - Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "60%",
          height: "100%",
          zIndex: 2,
          position: "relative",
        }}
      >
        {/* Title with emojis */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: 56, marginRight: "16px" }}>🔥</span>
          <h1
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              background: "linear-gradient(to right, #9333ea, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            VinylVerdict.FM
          </h1>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: "600",
            color: "white",
            lineHeight: 1.3,
            marginBottom: "24px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
          }}
        >
          Your Music Taste, Roasted to Perfection
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            fontWeight: "normal",
            color: "#d4d4d8",
            lineHeight: 1.4,
            marginBottom: "32px",
            maxWidth: "500px",
          }}
        >
          Your Personal Music Taste Analyst
        </div>

        {/* Call to action button */}
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            padding: "16px 32px",
            background: "linear-gradient(to right, #9333ea, #c084fc)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(147, 51, 234, 0.6)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "12px" }}>🎵</span>
          Get Roasted Now
        </div>
      </div>

      {/* Right side - Vinyl Record */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40%",
          height: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Outer vinyl record */}
        <div
          style={{
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #1a1a1a, #000000, #1a1a1a)",
            border: "2px solid rgba(147, 51, 234, 0.5)",
            boxShadow: "0 0 60px rgba(147, 51, 234, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.8)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Vinyl grooves */}
          <div
            style={{
              position: "absolute",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          />
          
          {/* Center label */}
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #9333ea, #c084fc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              boxShadow: "0 0 30px rgba(147, 51, 234, 0.8)",
            }}
          >
            🎧
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
