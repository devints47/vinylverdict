export async function uploadRoastImage(blob: Blob): Promise<string> {
  try {
    const response = await fetch("/api/upload-roast-image", {
      method: "POST",
      body: blob,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const { url } = await response.json()
    return url
  } catch (error) {
    console.error("Error uploading roast image:", error)
    throw new Error("Failed to upload image")
  }
}
