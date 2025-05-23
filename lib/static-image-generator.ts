// Update the static image generator to use the new approach

export function generateShareImageUrl(text: string, assistantType: string): string {
  // Get the app URL from environment variable or use a default
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

  // Create the share URL with the full text
  const encodedText = encodeURIComponent(text)

  // Generate the image URL
  return `${appUrl}/api/share-image?text=${encodedText}&type=${assistantType}`
}

export async function copyImageToClipboard(imageUrl: string): Promise<void> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    // Create a ClipboardItem
    const item = new ClipboardItem({ [blob.type]: blob })

    // Copy to clipboard
    await navigator.clipboard.write([item])
  } catch (error) {
    console.error("Error copying image to clipboard:", error)
    throw error
  }
}

export function downloadImage(imageUrl: string, fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary link
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = fileName
      document.body.appendChild(link)

      // Click the link to download
      link.click()

      // Clean up
      document.body.removeChild(link)
      resolve()
    } catch (error) {
      console.error("Error downloading image:", error)
      reject(error)
    }
  })
}

export function openSocialApp(platform: string): void {
  // Handle different platforms
  switch (platform) {
    case "instagram":
      // Open Instagram
      window.open("instagram://", "_blank")

      // Fallback to web version
      setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank")
      }, 500)
      break

    case "whatsapp":
      // Open WhatsApp
      window.open("whatsapp://", "_blank")

      // Fallback to web version
      setTimeout(() => {
        window.open("https://web.whatsapp.com/", "_blank")
      }, 500)
      break

    case "twitter":
      window.open("https://twitter.com/home", "_blank")
      break

    case "facebook":
      window.open("https://www.facebook.com/", "_blank")
      break

    default:
      // No specific action needed
      break
  }
}
