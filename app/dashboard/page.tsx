import type { Metadata } from "next"
import DashboardClientPage from "./DashboardClientPage"

export const metadata: Metadata = {
  title: "Music Dashboard - Your Spotify Analysis",
  description:
    "View your personalized Spotify music analysis with AI critics. See your top tracks, artists, and recent listening history with detailed insights from The Music Snob, Historian, Therapist, and Taste Validator.",
  keywords: [
    "spotify dashboard",
    "music analysis dashboard", 
    "spotify top tracks",
    "spotify top artists",
    "recently played spotify",
    "music taste dashboard",
    "spotify insights",
    "ai music analysis",
    "personal music stats",
    "spotify wrapped alternative"
  ],
  alternates: {
    canonical: "https://vinylverdict.fm/dashboard",
  },
  openGraph: {
    title: "Music Dashboard - Your Spotify Analysis | VinylVerdict.fm",
    description:
      "View your personalized Spotify music analysis with AI critics. See your top tracks, artists, and recent listening history with detailed insights.",
    url: "https://vinylverdict.fm/dashboard",
    type: "website",
    images: [
      {
        url: "https://vinylverdict.fm/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "VinylVerdict.fm Music Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music Dashboard - Your Spotify Analysis | VinylVerdict.fm",
    description: "View your personalized Spotify music analysis with AI critics.",
    images: ["https://vinylverdict.fm/opengraph-image.png"],
  },
  robots: {
    index: false, // Dashboard should not be indexed (requires auth)
    follow: true,
  },
}

// Structured data for the dashboard page
const dashboardStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Music Dashboard - Your Spotify Analysis",
  url: "https://vinylverdict.fm/dashboard",
  description: "View your personalized Spotify music analysis with AI critics. See your top tracks, artists, and recent listening history with detailed insights.",
  isPartOf: {
    "@type": "WebSite",
    name: "VinylVerdict.fm",
    url: "https://vinylverdict.fm"
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vinylverdict.fm"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dashboard",
        item: "https://vinylverdict.fm/dashboard"
      }
    ]
  }
}

export default function DashboardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dashboardStructuredData) }}
      />
      <DashboardClientPage />
    </>
  )
}
