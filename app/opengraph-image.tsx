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
        <svg
          width="380"
          height="380"
          viewBox="0 0 380 380"
          style={{
            filter: "drop-shadow(0 0 60px rgba(147, 51, 234, 0.6))",
          }}
        >
          {/* Outer vinyl record */}
          <circle cx="190" cy="190" r="190" fill="#1a1a1a" />
          
          {/* Vinyl grooves */}
          <circle cx="190" cy="190" r="170" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="190" cy="190" r="150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="190" cy="190" r="130" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="190" cy="190" r="110" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          
          {/* Purple center label */}
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
          <circle cx="190" cy="190" r="80" fill="url(#purpleGrad)" />
          
          {/* Label edge */}
          <circle cx="190" cy="190" r="80" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
          
          {/* Music Snob Face - Glasses */}
          <ellipse cx="170" cy="175" rx="12" ry="8" fill="none" stroke="black" strokeWidth="2" />
          <ellipse cx="210" cy="175" rx="12" ry="8" fill="none" stroke="black" strokeWidth="2" />
          
          {/* Bridge */}
          <line x1="182" y1="175" x2="198" y2="175" stroke="black" strokeWidth="2" />
          
          {/* Raised eyebrow */}
          <path d="M 158 165 Q 170 160 185 165" fill="none" stroke="black" strokeWidth="2" />
          
          {/* Unimpressed mouth */}
          <line x1="180" y1="200" x2="200" y2="198" stroke="black" strokeWidth="2" />
          
          {/* Center hole */}
          <circle cx="190" cy="190" r="8" fill="#000" />
          
          {/* VinylVerdict text around the label */}
          <path id="circle-text" d="M 190,110 A 80,80 0 1,1 189,110" fill="none" />
          <text fontSize="10" fill="black" fontWeight="bold">
            <textPath href="#circle-text" startOffset="0%">
              • VINYLVERDICT • PREMIUM VINYL • AUDIOPHILE COLLECTION •
            </textPath>
          </text>
        </svg>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
