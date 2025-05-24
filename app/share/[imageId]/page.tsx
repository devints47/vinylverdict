import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface SharePageProps {
  params: {
    imageId: string
  }
  searchParams: {
    text?: string
    type?: string
    imageUrl?: string
  }
}

export async function generateMetadata({ params, searchParams }: SharePageProps): Promise<Metadata> {
  const { text, type, imageUrl } = searchParams

  if (!imageUrl) {
    return {
      title: "VinylVerdict.fm - Music Taste Analysis",
      description: "Get your personalized music taste verdict at VinylVerdict.fm",
    }
  }

  const assistantName =
    type === "worshipper" ? "Taste Validator" : type === "historian" ? "Music Historian" : "Music Snob"

  const title = `My ${assistantName} Verdict - VinylVerdict.fm`
  const description = text ? text.substring(0, 160) + "..." : "Check out my music taste analysis!"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
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
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function SharePage({ params, searchParams }: SharePageProps) {
  const { text, type, imageUrl } = searchParams

  if (!imageUrl) {
    notFound()
  }

  const assistantName =
    type === "worshipper" ? "Taste Validator" : type === "historian" ? "Music Historian" : "Music Snob"

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-2xl font-bold text-purple-400">My {assistantName} Verdict</h1>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <img src={imageUrl || "/placeholder.svg"} alt="Music Taste Verdict" className="w-full rounded-lg mb-4" />

          {text && <div className="text-sm text-zinc-300 text-left">{text.substring(0, 200)}...</div>}
        </div>

        <div className="space-y-4">
          <p className="text-zinc-400">Get your own personalized music taste verdict</p>

          <a
            href="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Try VinylVerdict.fm
          </a>
        </div>
      </div>
    </div>
  )
}
