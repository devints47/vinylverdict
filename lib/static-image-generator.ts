/**
 * Generates a static share image URL
 */
export function generateShareImageUrl(text: string, assistantType: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

  // Encode the text and type for URL
  const encodedText = encodeURIComponent(text)
  const encodedType = encodeURIComponent(assistantType)

  return `${appUrl}/api/share-image?text=${encodedText}&type=${encodedType}`
}

/**
 * Copies an image to the clipboard
 */
export async function copyImageToClipboard(imageUrl: string): Promise<void> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const blob = await response.blob()

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
 * Downloads an image
 */
export async function downloadImage(imageUrl: string, filename: string): Promise<void> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading image:", error)
    throw error
  }
}

/**
 * Opens social media apps
 */
export function openSocialApp(platform: string): void {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

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
  if (!config) return

  if (isMobile) {
    window.location.href = config.appUrl
    setTimeout(() => window.open(config.webUrl, "_blank"), 1500)
  } else {
    window.open(config.webUrl, "_blank")
  }
}
