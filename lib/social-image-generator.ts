// Define the image formats
export type ImageFormat = "story"

// Interface for image generation options
interface GenerateImageOptions {
  text: string
  assistantType: string
  format: ImageFormat
  forceRefresh?: boolean
}

// Cache for generated image URLs to avoid redundant requests
const imageCache: Record<string, { url: string; timestamp: number }> = {}

/**
 * Generates a social media sharing image
 *
 * @param options - Image generation options
 * @returns Promise with the image URL
 */
export async function generateSocialImage({
  text,
  assistantType,
  format,
  forceRefresh = false,
}: GenerateImageOptions): Promise<string> {
  try {
    // Create a cache key based on the parameters
    const cacheKey = `${format}-${assistantType}-${text.substring(0, 50)}`

    // Check if we have a cached version and it's less than 5 minutes old
    const cachedImage = imageCache[cacheKey]
    if (!forceRefresh && cachedImage && Date.now() - cachedImage.timestamp < 5 * 60 * 1000) {
      console.log("Using cached image:", cachedImage.url)
      return cachedImage.url
    }

    // Get the app URL from environment variable or use window location
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

    // Truncate text appropriately for the format
    const maxLength = format === "story" ? 200 : 300
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text

    // Create the API URL with proper encoding
    const encodedText = encodeURIComponent(truncatedText)
    const encodedType = encodeURIComponent(assistantType)

    // Use the simpler endpoint for more reliable image generation
    const apiUrl = `${appUrl}/api/og/simple-story?text=${encodedText}&type=${encodedType}&t=${Date.now()}`

    // Add to cache
    imageCache[cacheKey] = {
      url: apiUrl,
      timestamp: Date.now(),
    }

    return apiUrl
  } catch (error) {
    console.error("Error generating social image:", error)
    throw new Error("Failed to generate social image")
  }
}

/**
 * Copies an image to the clipboard
 *
 * @param url - The image URL to copy
 * @returns Promise that resolves when the image is copied
 */
export async function copyImageToClipboard(url: string): Promise<void> {
  try {
    // Add cache-busting parameter if not already present
    const imageUrl = url.includes("?") ? `${url}&cb=${Date.now()}` : `${url}?cb=${Date.now()}`

    // Fetch the image with proper cache control
    const response = await fetch(imageUrl, {
      cache: "no-cache",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()

    // Check if the Clipboard API supports writing images
    if (navigator.clipboard && "write" in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])
    } else {
      throw new Error("Clipboard API not supported")
    }
  } catch (error) {
    console.error("Error copying image to clipboard:", error)
    throw error
  }
}

/**
 * Opens the appropriate social media app for sharing
 *
 * @param platform - The social media platform to open
 * @returns void
 */
export function openSocialApp(platform: string): void {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // Platform-specific deep links and fallbacks
  const platformConfig: Record<string, { appUrl: string; webUrl: string }> = {
    instagram: {
      appUrl: "instagram://story-camera",
      webUrl: "https://www.instagram.com/",
    },
    facebook: {
      appUrl: "fb://composer",
      webUrl: "https://www.facebook.com/",
    },
    twitter: {
      appUrl: "twitter://post",
      webUrl: "https://twitter.com/compose/tweet",
    },
    linkedin: {
      appUrl: "linkedin://compose",
      webUrl: "https://www.linkedin.com/sharing/share-offsite/",
    },
  }

  const config = platformConfig[platform]

  if (!config) {
    window.open("https://vinylverdict.fm", "_blank")
    return
  }

  if (isMobile) {
    // Try to open the app
    window.location.href = config.appUrl

    // Fallback to web version after a delay
    setTimeout(() => {
      window.open(config.webUrl, "_blank")
    }, 1500)
  } else {
    // For desktop, open web version
    window.open(config.webUrl, "_blank")
  }
}
