"use server"

import { put } from "@vercel/blob"

export async function uploadImageToBlob(base64Image: string): Promise<string> {
  try {
    // Convert base64 to blob
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, "base64")

    // Generate a unique filename
    const filename = `vinyl-verdict-${Date.now()}.png`

    // Upload to Vercel Blob
    const { url } = await put(filename, buffer, {
      access: "public",
      contentType: "image/png",
    })

    return url
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error)
    throw new Error("Failed to upload image to Vercel Blob")
  }
}
