import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    // Convert data URL to blob
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, "base64")

    // Generate a unique filename
    const filename = `vinyl-verdict-${Date.now()}.png`

    // Upload to Vercel Blob
    const { url } = await put(filename, buffer, {
      access: "public",
      contentType: "image/png",
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
