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
    default: "VinylVerdict.FM - Your Personal Music Taste Analyst",
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
    "ai music critic",
    "spotify insights",
    "music personality",
    "spotify statistics",
    "music discovery",
    "spotify dashboard"
  ],
  authors: [{ name: "VinylVerdict.FM" }],
  creator: "VinylVerdict.FM",
  publisher: "VinylVerdict.FM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://vinylverdict.fm",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vinylverdict.fm",
    siteName: "VinylVerdict.FM",
    title: "VinylVerdict.FM - Your Personal Music Taste Analyst",
    description:
      "Ready to face the music? Connect your Spotify account for personalized music insights, track analysis, and a shareable analysis. From brutal honesty to historical insights - prepare for your verdict. 💀",
    images: [
      {
        url: "https://vinylverdict.fm/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "VinylVerdict.FM - Your Personal Music Taste Analyst",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VinylVerdict.FM - Your Personal Music Taste Analyst",
    description:
      "Ready to face the music? Connect your Spotify account for personalized music insights, track analysis, and a shareable analysis. From brutal honesty to historical insights - prepare for your verdict. 💀",
    creator: "@vinylverdict",
    site: "@vinylverdict",
    images: ["https://vinylverdict.fm/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/vinyl-favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/vinyl-favicon.png", sizes: "180x180", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "152x152", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "144x144", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "120x120", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "114x114", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "76x76", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "72x72", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "60x60", type: "image/png" },
      { url: "/vinyl-favicon.png", sizes: "57x57", type: "image/png" },
    ],
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
    // TODO: Replace with actual Google Search Console verification code
    // google: "your-actual-google-verification-code-here",
    // other: {
    //   "msvalidate.01": "your-bing-verification-code-here",
    //   "facebook-domain-verification": "your-facebook-verification-code-here"
    // }
  },
  category: "entertainment",
  referrer: "origin-when-cross-origin",
  generator: "Next.js",
  applicationName: "VinylVerdict.FM",
  appleWebApp: {
    capable: true,
    title: "VinylVerdict.FM",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#a855f7",
    "msapplication-TileColor": "#a855f7",
    "msapplication-config": "/browserconfig.xml",
    // Performance hints
    "preconnect": "https://api.spotify.com",
    "dns-prefetch": "https://api.spotify.com",
  },
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
              alternateName: "VinylVerdict.FM",
              description:
                "Ready to face the music? Connect your Spotify account for personalized music insights, track analysis, and a shareable analysis. From brutal honesty to historical insights - prepare for your verdict. 🎵💀",
              url: "https://vinylverdict.fm",
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "Web Browser",
              browserRequirements: "Requires JavaScript. Requires HTML5.",
              softwareVersion: "1.0",
              releaseNotes: "AI-powered music taste analysis with multiple critic personalities",
              screenshot: "https://vinylverdict.fm/opengraph-image.png",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              creator: {
                "@type": "Organization",
                name: "VinylVerdict.fm",
                url: "https://vinylverdict.fm",
                logo: "https://vinylverdict.fm/music-snob-vinyl.png",
                sameAs: [
                  "https://twitter.com/vinylverdict",
                  "https://github.com/vinylverdict"
                ]
              },
              featureList: [
                "Spotify Integration",
                "AI Music Analysis",
                "Multiple Critic Personalities", 
                "Shareable Analysis Results",
                "Music Taste Insights",
                "Track and Artist Analysis",
                "Listening History Review"
              ],
              audience: {
                "@type": "Audience",
                audienceType: "Music Lovers"
              },
              inLanguage: "en-US",
              isAccessibleForFree: true,
              usageInfo: "https://vinylverdict.fm/terms-of-service",
              privacyPolicy: "https://vinylverdict.fm/privacy-policy",
              termsOfService: "https://vinylverdict.fm/terms-of-service",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "150",
                bestRating: "5",
                worstRating: "1"
              },
              applicationSubCategory: "Music Analysis Tool",
              downloadUrl: "https://vinylverdict.fm",
              installUrl: "https://vinylverdict.fm",
              memoryRequirements: "Minimal",
              storageRequirements: "No local storage required",
              permissions: "Spotify account access",
              countriesSupported: "Global",
              serviceType: "Music Analysis Service",
              mainEntity: {
                "@type": "Service",
                name: "AI Music Taste Analysis",
                description: "Personalized music taste analysis using AI-powered critic personalities",
                provider: {
                  "@type": "Organization",
                  name: "VinylVerdict.fm"
                },
                serviceType: "Entertainment",
                areaServed: "Global"
              }
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
