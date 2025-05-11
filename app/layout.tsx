import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SnobScore - Your Spotify Music Taste Analyzer",
  description:
    "Analyze your Spotify listening habits with Snobify.me. Get insights into your top tracks, artists, and genres with a touch of snark.",
  icons: [
    { rel: "icon", url: "/vinyl-favicon.png" },
    { rel: "apple-touch-icon", url: "/vinyl-favicon.png" },
  ],
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// Check for environment variables and log warnings but don't block rendering
const checkEnvironment = () => {
  // Check for required environment variables
  const requiredVars = ["NEXT_PUBLIC_SPOTIFY_CLIENT_ID", "NEXT_PUBLIC_REDIRECT_URI", "OPENAI_API_KEY"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(", ")}`)
  }

  // Check for OpenAI assistant IDs
  const assistantVars = {
    OPENAI_MUSIC_SNOB_ID: process.env.OPENAI_MUSIC_SNOB_ID,
    OPENAI_TASTE_VALIDATOR_ID: process.env.OPENAI_TASTE_VALIDATOR_ID,
  }

  const missingAssistants = Object.entries(assistantVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)

  if (missingAssistants.length > 0) {
    console.warn(`Missing OpenAI assistant IDs: ${missingAssistants.join(", ")}`)
  }
}

// Call the environment check function during initialization
if (typeof window === "undefined") {
  checkEnvironment()
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
