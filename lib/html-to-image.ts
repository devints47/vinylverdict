/**
 * Copies an image to the clipboard
 * @param dataUrl The data URL of the image
 */
export async function copyImageToClipboard(dataUrl: string): Promise<void> {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()

    // Create a ClipboardItem
    const item = new ClipboardItem({ [blob.type]: blob })

    // Write to clipboard
    await navigator.clipboard.write([item])
  } catch (error) {
    console.error("Error copying image to clipboard:", error)
    throw new Error("Failed to copy image to clipboard")
  }
}

/**
 * Opens social media apps
 * @param platform The social media platform to open
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
    default:
      break
  }
}
