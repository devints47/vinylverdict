/**
 * Utility functions for generating shareable images using html2canvas
 */
import html2canvas from "html2canvas"

/**
 * Generates a shareable image from a DOM element
 * @param element The DOM element to capture
 * @returns A Promise that resolves to a data URL of the image
 */
export async function generateImageFromElement(element: HTMLElement): Promise<string> {
  try {
    // Configure html2canvas with high quality settings
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      scale: 2, // Higher scale for better quality
      logging: false,
      backgroundColor: null, // Transparent background
      width: element.offsetWidth,
      height: element.offsetHeight,
    })

    // Convert canvas to data URL (PNG format with high quality)
    return canvas.toDataURL("image/png", 1.0)
  } catch (error) {
    console.error("Error generating image:", error)
    throw new Error("Failed to generate image")
  }
}

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
 * Downloads an image
 * @param dataUrl The data URL of the image
 * @param filename The filename to save the image as
 */
export async function downloadImage(dataUrl: string, filename: string): Promise<void> {
  try {
    // Create a download link
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error downloading image:", error)
    throw new Error("Failed to download image")
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
