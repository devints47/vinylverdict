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
  // Fetch the generated Music Snob vinyl image
  const musicSnobVinylData = await fetch(new URL('/music-snob-vinyl.png', 'https://vinylverdict.fm')).then(
    (res) => res.arrayBuffer(),
  )

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
          <span style={{ fontSize: 56, marginRight: "16px" }}>🎧</span>
          <h1
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "#9333ea",
              margin: 0,
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
          Your Personal Music Taste Analyst
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
          Connect your Spotify and take a look in the mirror.
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
          Face the Music
        </div>
      </div>

      {/* Right side - Music Snob Vinyl Record */}
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
        {/* Music Snob vinyl image - exact same as component with built-in glow */}
        <img
          src={`data:image/png;base64,${Buffer.from(musicSnobVinylData).toString('base64')}`}
          alt="Music Snob Vinyl"
          width="380"
          height="380"
          style={{
            // Glow effect is now built into the image, so no filter needed
          }}
        />
      </div>
    </div>,
    {
      ...size,
    },
  )
}
