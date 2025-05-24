export async function uploadRoastImage(imageBlob: Blob): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const filename = `roast-${timestamp}-${randomId}.png`

    // Upload to our API endpoint
    const response = await fetch(`/api/upload-roast-image?filename=${filename}`, {
      method: "POST",
      body: imageBlob,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const { url } = await response.json()
    return url
  } catch (error) {
    console.error("Error uploading roast image:", error)
    throw new Error("Failed to upload image")
  }
}
