import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    console.log("Upload image API called")

    const body = await request.json()
    const { imageData, timestamp } = body

    if (!imageData) {
      console.error("No image data provided")
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    console.log("Image data received, length:", imageData.length)
    console.log("Timestamp received:", timestamp)

    // Validate that it's a proper data URL
    if (!imageData.startsWith("data:image/")) {
      console.error("Invalid image data format")
      return NextResponse.json({ error: "Invalid image data format" }, { status: 400 })
    }

    // Convert data URL to blob
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, "base64")

    console.log("Buffer created, size:", buffer.length)

    // Use the provided timestamp or generate a new one
    const finalTimestamp = timestamp || Date.now()
    const filename = `vinyl-verdict-${finalTimestamp}.png`

    console.log("Uploading to Vercel Blob with filename:", filename)

    // Upload to Vercel Blob
    const { url } = await put(filename, buffer, {
      access: "public",
      contentType: "image/png",
    })

    console.log("Upload successful, URL:", url)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error)
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
