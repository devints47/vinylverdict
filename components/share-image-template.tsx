"use client"

import type { ReactNode } from "react"
import { VinylVerdictLogo } from "./vinyl-verdict-logo"

interface ShareImageTemplateProps {
  children: ReactNode
  assistantType: string
}

export function ShareImageTemplate({ children, assistantType }: ShareImageTemplateProps) {
  // Get the appropriate title based on assistant type
  const getTitle = () => {
    switch (assistantType) {
      case "worshipper":
        return "Music Taste Validation"
      case "historian":
        return "Music History Analysis"
      case "therapist":
        return "Music Psychology Analysis"
      case "snob":
      default:
        return "Music Taste Verdict"
    }
  }

  return (
    <div
      id="share-image-container"
      className="relative w-[1080px] h-[1920px] overflow-hidden"
      style={{
        backgroundColor: "#121212",
        backgroundImage: "url(/share-background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        padding: "60px 40px",
        fontFamily: "'Inter', sans-serif",
        color: "white",
      }}
    >
      {/* Header with logo and name */}
      <div className="flex items-center justify-center mb-10" style={{ display: "flex" }}>
        <div className="flex items-center gap-4" style={{ display: "flex" }}>
          <VinylVerdictLogo size={80} />
          <div>
            <h1
              className="text-4xl font-bold text-purple-gradient"
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #9333ea, #a855f7, #c026d3, #a855f7, #9333ea)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "block",
              }}
            >
              VinylVerdict.FM
            </h1>
            <p
              className="text-xl text-zinc-300"
              style={{
                fontSize: "20px",
                color: "#d4d4d8",
                display: "block",
              }}
            >
              {getTitle()}
            </p>
          </div>
        </div>
      </div>

      {/* Main content (roast) */}
      <div
        className="flex-1 bg-zinc-900/80 rounded-xl p-8 overflow-y-auto card-holographic"
        style={{
          flex: 1,
          backgroundColor: "rgba(24, 24, 27, 0.8)",
          borderRadius: "12px",
          padding: "32px",
          overflowY: "auto",
          border: "1px solid rgba(147, 51, 234, 0.3)",
          display: "block",
        }}
      >
        {children}
      </div>

      {/* Footer with Spotify attribution */}
      <div
        className="mt-10 flex items-center justify-center"
        style={{
          marginTop: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="flex items-center gap-4 bg-black/50 px-6 py-3 rounded-full"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "12px 24px",
            borderRadius: "9999px",
          }}
        >
          <span
            className="text-lg text-white"
            style={{
              fontSize: "18px",
              color: "white",
              display: "block",
            }}
          >
            Built Using the
          </span>
          <img 
            src="/spotify_full_logo.svg" 
            alt="Spotify" 
            className="h-8" 
            style={{ height: "32px" }} 
            width="100" 
            height="32"
          />
          <span
            className="text-lg text-white"
            style={{
              fontSize: "18px",
              color: "white",
              display: "block",
            }}
          >
            Web API
          </span>
        </div>
      </div>
    </div>
  )
}
