import type React from "react"
import type { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { AnimatedFavicon } from "@/components/animated-favicon"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Snobify - Your Spotify Stats with a Side of Sass",
  description: "View your Spotify listening statistics and get roasted by our music critics",
  icons: {
    icon: [
      {
        url: "/music-snob-favicon.ico",
        href: "/music-snob-favicon.ico",
      },
    ],
    apple: [
      {
        url: "/music-snob-apple-icon.png",
        sizes: "180x180",
        href: "/music-snob-apple-icon.png",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <AnimatedFavicon />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>{children}</AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
