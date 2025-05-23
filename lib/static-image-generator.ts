/**
 * Utility functions for generating and handling static share images
 */

/**
 * Generates a static share image URL
 */
export function generateShareImageUrl(text: string, assistantType: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
  const encodedText = encodeURIComponent(text.substring(0, 1000))
  const timestamp = Date.now() // Add timestamp to prevent caching
  return `${appUrl}/api/share-image?text=${encodedText}&type=${assistantType}&t=${timestamp}`
}

/**
 * Copies an image to the clipboard
 */
export async function copyImageToClipboard(imageUrl: string): Promise<void> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    // Create a ClipboardItem
    const item = new ClipboardItem({ [blob.type]: blob })

    // Write to clipboard
    await navigator.clipboard.write([item])
    return Promise.resolve()
  } catch (error) {
    console.error("Error copying image to clipboard:", error)
    return Promise.reject(error)
  }
}

/**
 * Downloads an image
 */
export async function downloadImage(imageUrl: string, filename: string): Promise<void> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    // Create a download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    return Promise.resolve()
  } catch (error) {
    console.error("Error downloading image:", error)
    return Promise.reject(error)
  }
}

/**
 * Opens social media apps
 */
export function openSocialApp(platform: string): void {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  switch (platform) {
    case "instagram":
      if (isMobile) {
        window.open("instagram://camera", "_blank")
        setTimeout(() => {
          window.open("https://www.instagram.com", "_blank")
        }, 1000)
      } else {
        window.open("https://www.instagram.com", "_blank")
      }
      break
    case "twitter":
      window.open("https://twitter.com/compose/tweet", "_blank")
      break
    case "facebook":
      window.open("https://www.facebook.com", "_blank")
      break
    case "linkedin":
      window.open("https://www.linkedin.com", "_blank")
      break
    case "whatsapp":
      if (isMobile) {
        window.open("whatsapp://", "_blank")
        setTimeout(() => {
          window.open("https://web.whatsapp.com", "_blank")
        }, 1000)
      } else {
        window.open("https://web.whatsapp.com", "_blank")
      }
      break
    case "messages":
      if (isMobile) {
        window.open("sms:", "_blank")
      } else {
        // For desktop, we'll just copy the text since SMS isn't directly available
        navigator.clipboard.writeText("Check out my music taste verdict from VinylVerdict.fm!")
      }
      break
    default:
      break
  }
}
