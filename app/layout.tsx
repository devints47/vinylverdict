import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { VinylProvider } from "@/contexts/vinyl-context"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vinylverdict.fm"),
  title: {
    default: "VinylVerdict - Your Personal Music Taste Critic",
    template: "%s | VinylVerdict",
  },
  description:
    "Connect your Spotify account and get a brutally honest critique of your music taste from our resident Music Snob. Discover insights about your listening habits with witty commentary.",
  keywords: [
    "music taste",
    "spotify analyzer",
    "music critic",
    "music taste analysis",
    "spotify statistics",
    "music recommendations",
    "music personality",
    "vinyl",
    "music snob",
  ],
  authors: [{ name: "VinylVerdict Team" }],
  creator: "VinylVerdict",
  publisher: "VinylVerdict",
  formatDetection: {
    email: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  themeColor: "#9333ea",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.vinylverdict.fm",
    siteName: "VinylVerdict",
    title: "VinylVerdict - Your Personal Music Taste Critic",
    description: "Get a brutally honest critique of your music taste based on your Spotify listening habits.",
    images: [
      {
        url: "https://www.vinylverdict.fm/og-image.png",
        width: 1200,
        height: 630,
        alt: "VinylVerdict - Your Personal Music Taste Critic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VinylVerdict - Your Personal Music Taste Critic",
    description: "Get a brutally honest critique of your music taste based on your Spotify listening habits.",
    images: ["https://www.vinylverdict.fm/og-image.png"],
    creator: "@vinylverdict",
  },
  alternates: {
    canonical: "https://www.vinylverdict.fm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
  icons: {
    icon: [{ url: "/vinyl-favicon.png" }, { url: "/vinyl-favicon.png", type: "image/png" }],
    shortcut: ["/vinyl-favicon.png"],
    apple: [{ url: "/vinyl-favicon.png" }, { url: "/vinyl-favicon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/vinyl-favicon.png",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Chrome-friendly favicon implementation */}
        <link rel="icon" href="/vinyl-favicon.png" sizes="any" />
        <link rel="icon" href="/vinyl-favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/vinyl-favicon.png" />

        {/* Explicitly add favicon.ico reference to prevent 404 */}
        <link rel="shortcut icon" href="/vinyl-favicon.png" />

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://api.spotify.com" />

        {/* Structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "VinylVerdict",
              url: "https://www.vinylverdict.fm",
              description:
                "Connect your Spotify account and get a brutally honest critique of your music taste from our resident Music Snob.",
              applicationCategory: "Entertainment",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              screenshot: "https://www.vinylverdict.fm/og-image.png",
              featureList: "Spotify integration, Music taste analysis, Personalized recommendations",
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <VinylProvider>
              {children}
              <ScrollToTop />
              <SpeedInsights />
              <Analytics />
            </VinylProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
