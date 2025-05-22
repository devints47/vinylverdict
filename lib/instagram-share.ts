// This function generates an Instagram-friendly image for sharing
export async function generateInstagramShareImage(
  text: string,
  assistantType: string,
  format: "post" | "story" = "post",
): Promise<string> {
  try {
    // Get the app URL from environment variable or use a default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

    // Create the API URL based on format
    const apiUrl =
      format === "story"
        ? `${appUrl}/api/og/stories?text=${encodeURIComponent(text)}&type=${assistantType}`
        : `${appUrl}/api/og?text=${encodeURIComponent(text)}&type=${assistantType}`

    // Return the URL to the generated image
    return apiUrl
  } catch (error) {
    console.error("Error generating Instagram share image:", error)
    throw new Error("Failed to generate Instagram share image")
  }
}

// This function downloads an image from a URL
export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = objectUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the object URL
    URL.revokeObjectURL(objectUrl)
  } catch (error) {
    console.error("Error downloading image:", error)
    throw new Error("Failed to download image")
  }
}

// This function copies an image to the clipboard
export async function copyImageToClipboard(url: string): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()

    // Check if the Clipboard API supports writing images
    if (navigator.clipboard && navigator.clipboard.write) {
      const item = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([item])
    } else {
      throw new Error("Clipboard API not supported")
    }
  } catch (error) {
    console.error("Error copying image to clipboard:", error)
    throw new Error("Failed to copy image to clipboard")
  }
}

// This function attempts to open the Instagram camera
export function openInstagramCamera(): void {
  // Try to open Instagram app on mobile
  const instagramUrl = "instagram://camera"
  const fallbackUrl = "https://www.instagram.com/"

  // For mobile devices, try to open the app
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = instagramUrl

    // Fallback to web version after a delay
    setTimeout(() => {
      window.open(fallbackUrl, "_blank")
    }, 1000)
  } else {
    // For desktop, open web version
    window.open(fallbackUrl, "_blank")
  }
}

// This function attempts to open Instagram Stories
export function openInstagramStories(): void {
  // Try to open Instagram stories on mobile
  const instagramUrl = "instagram://story-camera"
  const fallbackUrl = "https://www.instagram.com/"

  // For mobile devices, try to open the app
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = instagramUrl

    // Fallback to web version after a delay
    setTimeout(() => {
      window.open(fallbackUrl, "_blank")
    }, 1000)
  } else {
    // For desktop, open web version
    window.open(fallbackUrl, "_blank")
  }
}
