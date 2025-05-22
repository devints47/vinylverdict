// Instagram sharing utilities
export const generateInstagramShareImage = async (
  text: string,
  assistantType: string,
  format: "post" | "story" = "story", // Default to story format
): Promise<string> => {
  try {
    // Get the app URL from environment variable or use a default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin

    // Create the OG image URL (always use stories format)
    const shareText = encodeURIComponent(text.substring(0, 200)) // Shorter text for stories
    const ogImageUrl = `${appUrl}/api/og/stories?text=${shareText}&type=${assistantType}`

    return ogImageUrl
  } catch (error) {
    console.error("Error generating Instagram share image:", error)
    throw error
  }
}

export const copyImageToClipboard = async (imageUrl: string): Promise<void> => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    // Check if the browser supports clipboard API for images
    if (navigator.clipboard && "write" in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])
    } else {
      // Fallback: download the image
      throw new Error("Clipboard API not supported")
    }
  } catch (error) {
    console.error("Error copying image to clipboard:", error)
    throw error
  }
}

// Instagram app deep linking utility (focus on Stories)
export const openInstagramStories = () => {
  // Try to open Instagram Stories directly
  const instagramStoriesUrl = "instagram://story-camera"
  const fallbackUrl = "https://www.instagram.com/stories/camera/"

  // For mobile devices, try to open the app
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = instagramStoriesUrl

    // Fallback to web version after a delay
    setTimeout(() => {
      window.open(fallbackUrl, "_blank")
    }, 1500)
  } else {
    // For desktop, open web version
    window.open(fallbackUrl, "_blank")
  }
}
