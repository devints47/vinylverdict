import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "VinylVerdict.FM - Your Music Taste Personified",
  description:
    "Connect your Spotify account and get personalized music critiques from unique AI personalities. Discover insights about your listening habits with brutal honesty, historical context, and expert analysis.",
  generator: "Next.js",
  keywords: ["music", "spotify", "ai", "critique", "analysis", "taste", "recommendations"],
  authors: [{ name: "VinylVerdict" }],
  openGraph: {
    title: "VinylVerdict.FM - Your Music Taste Personified",
    description: "Connect your Spotify account and get personalized music critiques from unique AI personalities.",
    type: "website",
    url: "https://vinylverdict.fm",
  },
  twitter: {
    card: "summary_large_image",
    title: "VinylVerdict.FM - Your Music Taste Personified",
    description: "Connect your Spotify account and get personalized music critiques from unique AI personalities.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
