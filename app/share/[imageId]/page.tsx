import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"

interface SharePageProps {
  params: { imageId: string }
  searchParams: {
    text?: string
    type?: string
    imageUrl?: string
    title?: string
  }
}

export async function generateMetadata({ params, searchParams }: SharePageProps): Promise<Metadata> {
  const { text, type, imageUrl, title } = searchParams

  if (!text || !imageUrl) {
    return {
      title: "VinylVerdict.fm - Music Taste Analysis",
      description: "Get your personalized music taste analysis at VinylVerdict.fm",
    }
  }

  const personalityName =
    type === "worshipper" ? "The Taste Validator" : type === "historian" ? "The Music Historian" : "The Music Snob"

  const pageTitle = title || `My ${personalityName} Verdict from VinylVerdict.fm`
  const description = text.substring(0, 160) + "..."

  return {
    title: pageTitle,
    description: description,
    openGraph: {
      title: pageTitle,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 1920,
          alt: `Music taste analysis by ${personalityName}`,
        },
      ],
      type: "website",
      siteName: "VinylVerdict.fm",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: description,
      images: [imageUrl],
      site: "@VinylVerdictFM",
    },
  }
}

export default function SharePage({ params, searchParams }: SharePageProps) {
  const { text, type, imageUrl, title } = searchParams

  if (!text || !imageUrl) {
    notFound()
  }

  const personalityName =
    type === "worshipper" ? "The Taste Validator" : type === "historian" ? "The Music Historian" : "The Music Snob"

  const pageTitle = title || `My ${personalityName} Verdict`

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{pageTitle}</h1>
          <p className="text-zinc-400">Shared from VinylVerdict.fm</p>
        </div>

        <div className="relative w-full max-w-md mx-auto">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`Music taste analysis by ${personalityName}`}
            width={1080}
            height={1920}
            className="w-full rounded-lg shadow-2xl"
            priority
          />
        </div>

        <div className="text-center space-y-4">
          <p className="text-zinc-300 text-lg">Get your own personalized music taste analysis</p>
          <a
            href="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try VinylVerdict.fm
          </a>
        </div>
      </div>
    </div>
  )
}
