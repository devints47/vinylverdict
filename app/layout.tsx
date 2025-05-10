import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

// Update the metadata title and description
export const metadata: Metadata = {
  title: "SnobScore - Your Personal Music Taste Critic",
  description:
    "Connect your Spotify account and let our resident Music Snob analyze your listening habits with brutal honesty and witty commentary.",
  icons: {
    icon: "/vinyl-favicon.png",
    apple: "/vinyl-apple-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Use the new vinyl favicon */}
        <link rel="icon" href="/vinyl-favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/vinyl-apple-icon.png" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <Suspense>{children}</Suspense>
          </AuthProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
