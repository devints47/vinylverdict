import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getShareData } from "@/lib/share-storage"
import SharePageClient from "./share-page-client"

interface SharePageProps {
  params: { id: string }
}

// Generate metadata for social sharing
export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = params

  const shareData = await getShareData(id)

  if (!shareData) {
    return {
      title: "VinylVerdict - Music Taste Verdict",
      description: "Get your personalized music taste analysis",
    }
  }

  const { text, type, imageUrl } = shareData

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
  const shareUrl = `${appUrl}/s/${id}`

  // Determine the best image URL
  const metaImageUrl =
    imageUrl || `${appUrl}/api/og/share?text=${encodeURIComponent(text.substring(0, 200))}&type=${type}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: "VinylVerdict",
      type: "website",
      images: [
        {
          url: metaImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [metaImageUrl],
      site: "@vinylverdict",
      creator: "@vinylverdict",
    },
    // Apple-specific meta tags for better iMessage integration
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/png",
      "og:image:alt": title,
      // Apple-specific tags
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": "VinylVerdict",
      // Additional OG tags for better compatibility
      "og:locale": "en_US",
      "og:site_name": "VinylVerdict",
      // Ensure the image is properly formatted for iMessage
      "og:image:secure_url": metaImageUrl,
    },
    // Add structured data for rich snippets
    alternates: {
      canonical: shareUrl,
    },
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = params

  // Get share data from storage
  const shareData = await getShareData(id)

  if (!shareData) {
    notFound()
  }

  return <SharePageClient text={shareData.text} type={shareData.type} imageUrl={shareData.imageUrl} />
}
