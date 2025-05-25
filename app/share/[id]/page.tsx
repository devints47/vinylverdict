import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SharePageClient from "./share-page-client"

interface SharePageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generate metadata for social sharing
export async function generateMetadata({ params, searchParams }: SharePageProps): Promise<Metadata> {
  const { id } = params
  const text = searchParams.text as string
  const type = searchParams.type as string
  const imageUrl = searchParams.image as string

  if (!text || !type) {
    return {
      title: "VinylVerdict - Music Taste Verdict",
      description: "Get your personalized music taste analysis",
    }
  }

  // Get title based on assistant type
  let title = "Music Taste Verdict from VinylVerdict"
  let description = "Check out this music taste analysis from VinylVerdict!"

  if (type === "worshipper") {
    title = "Music Taste Validation from VinylVerdict"
    description = "Check out this music taste validation from VinylVerdict!"
  } else if (type === "historian") {
    title = "Music History Analysis from VinylVerdict"
    description = "Check out this music history analysis from VinylVerdict!"
  } else if (type === "snob") {
    title = "Music Taste Roast from VinylVerdict"
    description = "Check out this music taste roast from VinylVerdict!"
  }

  // Extract a snippet from the text for description
  const textSnippet = text.substring(0, 150).replace(/[#*]/g, "").trim()
  if (textSnippet) {
    description = `${textSnippet}${textSnippet.length >= 150 ? "..." : ""}`
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vinylverdict.fm"
  const shareUrl = `${appUrl}/share/${id}?text=${encodeURIComponent(text)}&type=${type}${imageUrl ? `&image=${encodeURIComponent(imageUrl)}` : ""}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: "VinylVerdict",
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: `${appUrl}/api/og/share?text=${encodeURIComponent(text.substring(0, 200))}&type=${type}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl
        ? [imageUrl]
        : [`${appUrl}/api/og/share?text=${encodeURIComponent(text.substring(0, 200))}&type=${type}`],
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/png",
    },
  }
}

export default function SharePage({ params, searchParams }: SharePageProps) {
  const { id } = params
  const text = searchParams.text as string
  const type = searchParams.type as string
  const imageUrl = searchParams.image as string

  if (!text || !type) {
    notFound()
  }

  return <SharePageClient text={text} type={type} imageUrl={imageUrl} />
}
