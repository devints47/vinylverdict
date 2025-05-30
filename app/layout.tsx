import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { VinylProvider } from "@/contexts/vinyl-context"
import { ToastProvider, Toaster } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://vinylverdict.fm"),
  title: {
    default: "VinylVerdict.FM 🎧 Your Personal Music Taste Analyst",
    template: "%s | VinylVerdict.FM",
  },
  description:
    "Ready to face the music? Connect your Spotify account for personalized music insights, track analysis, and a shareable analysis. From brutal honesty to historical insights - prepare for your verdict. 💀",
  keywords: [
    "spotify analysis",
    "spotify wrapped",
    "spotify roast",
    "music taste analysis",
    "spotify wrapped alternative",
    "music critic ai",
    "spotify stats funny",
    "music taste test",
    "vinyl verdict",
    "spotify judgment",
    "music personality test",
    "spotify data analysis",
  ],
  authors: [{ name: "VinylVerdict.FM" }],
  creator: "VinylVerdict.FM",
  publisher: "VinylVerdict.FM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vinylverdict.fm",
    siteName: "VinylVerdict.FM",
    title: "VinylVerdict.FM 🎧 Your Personal Music Taste Analyst",
    description:
      "Ready to face the music? Connect your Spotify account for personalized music insights, track analysis, and a shareable analysis. From brutal honesty to historical insights - prepare for your verdict. 💀",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VinylVerdict.FM 🎧 Your Personal Music Taste Analyst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VinylVerdict.FM 🎧 Your Personal Music Taste Analyst",
    description:
      "Ready to face the music? Connect your Spotify account for personalized music insights, track analysis, and a shareable analysis. From brutal honesty to historical insights - prepare for your verdict. 💀",
    images: ["/og-image.png"],
    creator: "@vinylverdict",
    site: "@vinylverdict",
  },
  icons: {
    icon: [
      { url: "/vinyl-favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/vinyl-favicon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/vinyl-favicon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  category: "entertainment",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "VinylVerdict.fm",
              description:
                "Ready to face the music? Connect your Spotify account for personalized music insights, track analysis, and a shareable analysis. From brutal honesty to historical insights - prepare for your verdict. 🎵💀",
              url: "https://vinylverdict.fm",
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "VinylVerdict.fm",
              },
              featureList: [
                "Spotify Integration",
                "AI Music Roasting",
                "Multiple Critic Personalities", 
                "Shareable Roast Results",
                "Musical Judgment & Humiliation",
              ],
            }),
          }}
        />
      </head>
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
