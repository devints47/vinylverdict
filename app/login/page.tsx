import type { Metadata } from "next"
import LoginPageClient from "./LoginPageClient"

export const metadata: Metadata = {
  title: "Login with Spotify",
  description:
    "Connect your Spotify account to get personalized music taste analysis from AI critics. Secure OAuth login with Spotify Web API.",
  openGraph: {
    title: "Login with Spotify | VinylVerdict.fm",
    description: "Connect your Spotify account to get personalized music taste analysis from AI critics.",
  },
}

export default function LoginPage() {
  return <LoginPageClient />
}
