import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Check } from "lucide-react"

interface PageProps {
  params: {
    code: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    // Decode the URL
    const decoded = Buffer.from(params.code, "base64").toString()
    const [timestamp, imageUrl] = decoded.split("|")

    // Check if URL has expired (30 days)
    const urlTimestamp = Number.parseInt(timestamp)
    const now = Date.now()
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

    if (now - urlTimestamp > thirtyDaysInMs) {
      return {
        title: "Verdict Not Found | VinylVerdict.fm",
        description: "This shared verdict may have expired or doesn't exist.",
      }
    }

    return {
      title: "Music Taste Verdict | VinylVerdict.fm",
      description: "Check out this personalized music taste verdict from VinylVerdict.fm!",
      openGraph: {
        images: [imageUrl],
        title: "Music Taste Verdict | VinylVerdict.fm",
        description: "Check out this personalized music taste verdict from VinylVerdict.fm!",
        url: `https://vinylverdict.fm/s/${params.code}`,
        siteName: "VinylVerdict.fm",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Music Taste Verdict | VinylVerdict.fm",
        description: "Check out this personalized music taste verdict from VinylVerdict.fm!",
        images: [imageUrl],
      },
    }
  } catch (error) {
    return {
      title: "Verdict Not Found | VinylVerdict.fm",
      description: "This shared verdict may have expired or doesn't exist.",
    }
  }
}

export default function SharedVerdictPage({ params }: PageProps) {
  try {
    // Decode the URL
    const decoded = Buffer.from(params.code, "base64").toString()
    const [timestamp, imageUrl] = decoded.split("|")

    // Check if URL has expired (30 days)
    const urlTimestamp = Number.parseInt(timestamp)
    const now = Date.now()
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

    if (now - urlTimestamp > thirtyDaysInMs) {
      notFound()
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="max-w-4xl w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-purple-500">Music Taste Verdict</h1>
            <p className="text-zinc-400">Shared from VinylVerdict.fm</p>
          </div>

          <div className="relative rounded-lg overflow-hidden mb-8 border border-zinc-800">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Music Taste Verdict"
              width={1080}
              height={1920}
              className="w-full h-auto"
              priority
            />
          </div>

          <div className="text-center mb-8">
            <p className="text-lg mb-4">Want to get your own personalized music taste verdict?</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Check className="mr-2 h-5 w-5" />
              Get Your Verdict at VinylVerdict.fm
            </Link>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
