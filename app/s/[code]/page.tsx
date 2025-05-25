import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SharedImageDisplay } from "./shared-image-display"

interface PageProps {
  params: {
    code: string
  }
}

// Helper function to decode the URL with URL-safe base64
function decodeShareCode(code: string): { imageUrl: string; timestamp: number } | null {
  try {
    console.log("Decoding share code:", code)

    // Convert URL-safe base64 back to standard base64
    let base64Data = code.replace(/-/g, "+").replace(/_/g, "/")

    // Add padding if needed
    if (base64Data.length % 4 === 2) base64Data += "=="
    else if (base64Data.length % 4 === 3) base64Data += "="

    const decodedData = Buffer.from(base64Data, "base64").toString("utf-8")
    console.log("Decoded data:", decodedData)

    const parts = decodedData.split("|")

    if (parts.length !== 2) {
      console.error("Invalid format: Decoded data doesn't have two parts separated by |")
      return null
    }

    const [timestamp, imageUrl] = parts
    console.log("Parsed timestamp:", timestamp, "imageUrl:", imageUrl)

    return {
      imageUrl,
      timestamp: Number.parseInt(timestamp, 10),
    }
  } catch (error) {
    console.error("Error decoding share code:", error)
    return null
  }
}

// Generate metadata for social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const code = params.code
    if (!code) {
      return {
        title: "VinylVerdict.fm",
        description: "Personalized Music Taste Analysis",
      }
    }

    const decoded = decodeShareCode(code)
    if (!decoded) {
      return {
        title: "VinylVerdict.fm",
        description: "Personalized Music Taste Analysis",
      }
    }

    // Return metadata with the image
    return {
      title: "My Music Taste Verdict | VinylVerdict.fm",
      description: "Check out this personalized music taste verdict from VinylVerdict.fm!",
      openGraph: {
        title: "My Music Taste Verdict | VinylVerdict.fm",
        description: "Check out this personalized music taste verdict from VinylVerdict.fm!",
        images: [
          {
            url: decoded.imageUrl,
            width: 1080,
            height: 1920,
            alt: "Music Taste Verdict",
          },
        ],
        type: "website",
        siteName: "VinylVerdict.fm",
      },
      twitter: {
        card: "summary_large_image",
        title: "My Music Taste Verdict | VinylVerdict.fm",
        description: "Check out this personalized music taste verdict from VinylVerdict.fm!",
        images: [decoded.imageUrl],
      },
    }
  } catch (error) {
    console.error("Error in generateMetadata:", error)
    return {
      title: "VinylVerdict.fm",
      description: "Personalized Music Taste Analysis",
    }
  }
}

export default function SharedVerdictPage({ params }: PageProps) {
  try {
    const code = params.code
    if (!code) {
      notFound()
    }

    const decoded = decodeShareCode(code)
    if (!decoded) {
      notFound()
    }

    // Check if the URL has expired (30 days)
    if (Date.now() - decoded.timestamp > 30 * 24 * 60 * 60 * 1000) {
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
            <SharedImageDisplay imageUrl={decoded.imageUrl} />
          </div>

          <div className="text-center mb-8">
            <p className="text-lg mb-4">Want to get your own personalized music taste verdict?</p>
            <a
              href="/"
              className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Get Your Verdict at VinylVerdict.fm
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in SharedVerdictPage:", error)
    notFound()
  }
}
