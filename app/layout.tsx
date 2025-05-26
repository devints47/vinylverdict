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
    default: "VinylVerdict.fm - AI Music Taste Analysis & Spotify Integration",
    template: "%s | VinylVerdict.fm",
  },
  description:
    "Get your Spotify music taste analyzed by AI personalities. Connect your account for personalized music insights, track analysis, and shareable verdicts. Free music taste test with multiple AI critics.",
  keywords: [
    "spotify analysis",
    "music taste test",
    "ai music critic",
    "spotify stats",
    "music personality",
    "spotify wrapped",
    "music taste analysis",
    "spotify insights",
    "music recommendations",
    "spotify data visualization",
  ],
  authors: [{ name: "VinylVerdict.fm" }],
  creator: "VinylVerdict.fm",
  publisher: "VinylVerdict.fm",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vinylverdict.fm",
    siteName: "VinylVerdict.fm",
    title: "VinylVerdict.fm - AI Music Taste Analysis & Spotify Integration",
    description:
      "Get your Spotify music taste analyzed by AI personalities. Connect your account for personalized music insights, track analysis, and shareable verdicts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VinylVerdict.fm - AI Music Taste Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VinylVerdict.fm - AI Music Taste Analysis & Spotify Integration",
    description:
      "Get your Spotify music taste analyzed by AI personalities. Connect your account for personalized music insights and shareable verdicts.",
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
                "AI-powered music taste analysis using Spotify data. Get personalized insights from multiple AI music critics.",
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
                "AI Music Analysis",
                "Multiple Critic Personalities",
                "Shareable Results",
                "Music Taste Insights",
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
