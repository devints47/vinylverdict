import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { VinylProvider } from "@/contexts/vinyl-context"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VinylVerdict - Your Personal Music Taste Critic",
  description:
    "Connect your Spotify account and get a brutally honest critique of your music taste from our resident Music Snob.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/vinyl-favicon.png" type="image/png" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <VinylProvider>
            {children}
            <ScrollToTop />
          </VinylProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
