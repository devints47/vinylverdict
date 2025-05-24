import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { VinylProvider } from "@/contexts/vinyl-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VinylVerdict.fm - Your Music Taste Personified",
  description:
    "Connect your Spotify account and get your music taste analyzed by unique personalities, from brutal honesty to historical insights.",
  openGraph: {
    title: "VinylVerdict.fm - Your Music Taste Personified",
    description:
      "Connect your Spotify account and get your music taste analyzed by unique personalities, from brutal honesty to historical insights.",
    url: "https://vinylverdict.fm",
    siteName: "VinylVerdict.fm",
    images: [
      {
        url: "https://vinylverdict.fm/og-image.png",
        width: 1200,
        height: 630,
        alt: "VinylVerdict.fm - Your Music Taste Personified",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VinylVerdict.fm - Your Music Taste Personified",
    description:
      "Connect your Spotify account and get your music taste analyzed by unique personalities, from brutal honesty to historical insights.",
    images: ["https://vinylverdict.fm/og-image.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <VinylProvider>
            {children}
            <Toaster />
          </VinylProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
