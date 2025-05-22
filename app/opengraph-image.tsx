import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "VinylVerdict - Your Personal Music Taste Critic"
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #1e1e1e, #121212, #0a0a0a)",
        padding: "40px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Abstract waveform background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.2,
          zIndex: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.3), transparent 70%)",
        }}
      />

      {/* Vinyl record decoration */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "#000",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 0 40px rgba(147, 51, 234, 0.3)",
          opacity: 0.6,
          zIndex: 1,
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
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: 48, marginRight: "12px" }}>🔥</span>
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
            VinylVerdict
          </h1>
          <span style={{ fontSize: 48, marginLeft: "12px" }}>🔥</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: "normal",
            color: "white",
            lineHeight: 1.4,
            marginBottom: "40px",
            maxWidth: "100%",
            textAlign: "center",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          Your Personal Music Taste Critic
        </div>

        {/* Call to action */}
        <div
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
            padding: "12px 24px",
            background: "linear-gradient(to right, #9333ea, #c084fc)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(147, 51, 234, 0.5)",
          }}
        >
          Connect with Spotify & Get Roasted
        </div>
      </div>
    </div>,
    {
      ...size,
      alt,
    },
  )
}
