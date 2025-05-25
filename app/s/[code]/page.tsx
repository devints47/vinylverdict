import type { Metadata } from "next"
import { get } from "@vercel/blob"
import { notFound } from "next/navigation"

interface UrlMapping {
  originalUrl: string
  createdAt: number
  expiresAt: number
}

interface PageProps {
  params: { code: string }
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

    // Try to get the mapping from Vercel Blob
    try {
      const blob = await get(`url-mapping-${code}.json`)

      if (!blob) {
        return {
          title: "VinylVerdict.fm",
          description: "Personalized Music Taste Analysis",
        }
      }

      const text = await blob.text()
      const mapping: UrlMapping = JSON.parse(text)

      // Check if the URL has expired
      if (mapping.expiresAt < Date.now()) {
        return {
          title: "VinylVerdict.fm",
          description: "Personalized Music Taste Analysis",
        }
      }

      // Return metadata with the image
      return {
        title: "My Music Taste Verdict - VinylVerdict.fm",
        description: "Check out my personalized music taste analysis from VinylVerdict.fm!",
        openGraph: {
          title: "My Music Taste Verdict - VinylVerdict.fm",
          description: "Check out my personalized music taste analysis from VinylVerdict.fm!",
          images: [
            {
              url: mapping.originalUrl,
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
          title: "My Music Taste Verdict - VinylVerdict.fm",
          description: "Check out my personalized music taste analysis from VinylVerdict.fm!",
          images: [mapping.originalUrl],
        },
      }
    } catch (error) {
      console.error("Error retrieving URL mapping for metadata:", error)
      return {
        title: "VinylVerdict.fm",
        description: "Personalized Music Taste Analysis",
      }
    }
  } catch (error) {
    console.error("Error in generateMetadata:", error)
    return {
      title: "VinylVerdict.fm",
      description: "Personalized Music Taste Analysis",
    }
  }
}

export default async function SharedImagePage({ params }: PageProps) {
  try {
    const code = params.code

    if (!code) {
      notFound()
    }

    // Try to get the mapping from Vercel Blob
    let mapping: UrlMapping
    try {
      const blob = await get(`url-mapping-${code}.json`)

      if (!blob) {
        notFound()
      }

      const text = await blob.text()
      mapping = JSON.parse(text)

      // Check if the URL has expired
      if (mapping.expiresAt < Date.now()) {
        notFound()
      }
    } catch (error) {
      console.error("Error retrieving URL mapping:", error)
      notFound()
    }

    // Return a page that displays the image
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Music Taste Verdict</h1>
            <p className="text-zinc-400">Shared from VinylVerdict.fm</p>
          </div>

          {/* Image Container */}
          <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            <img
              src={mapping.originalUrl || "/placeholder.svg"}
              alt="Music Taste Verdict"
              className="w-full h-auto"
              style={{ maxHeight: "80vh", objectFit: "contain" }}
            />
          </div>

          {/* Footer */}
          <div className="text-center mt-8 space-y-4">
            <p className="text-zinc-400">Want your own personalized music taste analysis?</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Get Your Verdict at VinylVerdict.fm
            </a>

            {/* Social sharing buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my music taste verdict from VinylVerdict.fm!")}&url=${encodeURIComponent(`https://vinylverdict.fm/s/${code}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://vinylverdict.fm/s/${code}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in SharedImagePage:", error)
    notFound()
  }
}
