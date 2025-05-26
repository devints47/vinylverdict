import type { Metadata } from "next"
import DashboardClientPage from "./DashboardClientPage"

export const metadata: Metadata = {
  title: "Music Dashboard - Your Spotify Analysis",
  description:
    "View your personalized Spotify music analysis with AI critics. See your top tracks, artists, and recent listening history with detailed insights.",
  openGraph: {
    title: "Music Dashboard - Your Spotify Analysis | VinylVerdict.fm",
    description:
      "View your personalized Spotify music analysis with AI critics. See your top tracks, artists, and recent listening history.",
  },
}

export default function DashboardPage() {
  return <DashboardClientPage />
}
