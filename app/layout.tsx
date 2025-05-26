import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { VinylProvider } from "@/contexts/vinyl-context"
import { ToastProvider, Toaster } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VinylVerdict.fm - Your Music Taste, Judged",
  description:
    "Connect your Spotify account and get your music taste analyzed and judged by our resident music critics. See your top tracks, artists, and recent listening history.",
  openGraph: {
    title: "VinylVerdict.fm - Your Music Taste, Judged",
    description:
      "Connect your Spotify account and get your music taste analyzed and judged by our resident music critics. See your top tracks, artists, and recent listening history.",
    url: "https://vinylverdict.fm",
    siteName: "VinylVerdict.fm",
    images: [
      {
        url: "https://vinylverdict.fm/og-image.png",
        width: 1200,
        height: 630,
        alt: "VinylVerdict.fm",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VinylVerdict.fm - Your Music Taste, Judged",
    description:
      "Connect your Spotify account and get your music taste analyzed and judged by our resident music critics. See your top tracks, artists, and recent listening history.",
    images: ["https://vinylverdict.fm/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/vinyl-favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/vinyl-favicon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/vinyl-favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <VinylProvider>
              {children}
              <Toaster />
            </VinylProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
